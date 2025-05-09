// routes/orders.js
const express = require('express');
const router = express.Router();
const { 
  getOrders, 
  getOrderById, 
  createOrder, 
  updateOrderStatus, 
  getAllOrders 
} = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middleware/auths');
const { orderValidation, validateResult } = require('../middleware/Validators');

// All order routes require authentication
router.use(authenticate);

// Get all orders for current user
router.get('/', getOrders);

// Get order by ID
router.get('/:id', getOrderById);

// Create a new order
router.post('/', orderValidation, validateResult, createOrder);

// Admin routes
// Update order status (admin only)
router.put('/:id/status', isAdmin, updateOrderStatus);

// Get all orders (admin only)
router.get('/admin/all', isAdmin, getAllOrders);

module.exports = router;