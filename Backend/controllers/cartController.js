// controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'image', 'stockQuantity']
        }
      ]
    });
    
    // Calculate total
    let total = 0;
    cartItems.forEach(item => {
      total += item.Product.price * item.quantity;
    });
    
    res.json({
      cartItems,
      total: parseFloat(total.toFixed(2)),
      itemCount: cartItems.length
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check stock availability
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }
    
    // Check if item is already in cart
    let cartItem = await Cart.findOne({
      where: { userId: req.userId, productId }
    });
    
    if (cartItem) {
      // Update quantity if item exists
      const newQuantity = cartItem.quantity + parseInt(quantity);
      
      // Check if new quantity exceeds stock
      if (newQuantity > product.stockQuantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
      
      cartItem.quantity = newQuantity;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await Cart.create({
        userId: req.userId,
        productId,
        quantity: parseInt(quantity)
      });
    }
    
    res.status(201).json({
      message: 'Item added to cart',
      cartItem
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    
    // Find cart item
    const cartItem = await Cart.findOne({
      where: { id: req.params.id, userId: req.userId },
      include: [{ model: Product }]
    });
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    // Check stock availability
    if (cartItem.Product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }
    
    // Update quantity
    cartItem.quantity = parseInt(quantity);
    await cartItem.save();
    
    res.json({
      message: 'Cart updated',
      cartItem
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    // Find cart item
    const cartItem = await Cart.findOne({
      where: { id: req.params.id, userId: req.userId }
    });
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    // Delete cart item
    await cartItem.destroy();
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    // Delete all cart items for user
    await Cart.destroy({
      where: { userId: req.userId }
    });
    
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};