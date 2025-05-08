// controllers/orderController.js
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const db = require('../config/db');

// Get all orders for current user
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'name', 'image'] }]
        }
      ]
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { 
        id: req.params.id,
        userId: req.userId 
      },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'name', 'image'] }]
        }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  // Start a transaction
  const transaction = await db.transaction();
  
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    // Get user's cart
    const cartItems = await Cart.findAll({
      where: { userId: req.userId },
      include: [{ model: Product }],
      transaction
    });
    
    if (cartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Calculate total
    let total = 0;
    for (const item of cartItems) {
      total += item.Product.price * item.quantity;
      
      // Check stock availability
      if (item.Product.stockQuantity < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: `Not enough stock for ${item.Product.name}. Available: ${item.Product.stockQuantity}` 
        });
      }
      
      // Update product stock
      item.Product.stockQuantity -= item.quantity;
      await item.Product.save({ transaction });
    }
    
    // Create order
    const order = await Order.create(
      {
        userId: req.userId,
        total,
        shippingAddress,
        paymentMethod,
        status: 'pending'
      },
      { transaction }
    );
    
    // Create order items
    const orderItems = [];
    for (const item of cartItems) {
      const orderItem = await OrderItem.create(
        {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.Product.price
        },
        { transaction }
      );
      orderItems.push(orderItem);
    }
    
    // Clear cart
    await Cart.destroy({
      where: { userId: req.userId },
      transaction
    });
    
    // Commit transaction
    await transaction.commit();
    
    res.status(201).json({
      message: 'Order created successfully',
      order: {
        ...order.toJSON(),
        orderItems
      }
    });
  } catch (error) {
    // Rollback transaction
    await transaction.rollback();
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Find order
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Update status
    order.status = status;
    await order.save();
    
    res.json({
      message: 'Order status updated',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add status filter if provided
    if (status) {
      filter.status = status;
    }
    
    // Add date range filter if provided
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Get orders
    const orders = await Order.findAndCountAll({
      where: filter,
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'name', 'image'] }]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      totalOrders: orders.count,
      totalPages: Math.ceil(orders.count / limit),
      currentPage: parseInt(page),
      orders: orders.rows
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};