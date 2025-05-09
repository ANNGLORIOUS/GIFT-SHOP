// routes/cart.js
const express = require('express');
const router = express.Router();
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} = require('../controllers/cartController');
const { authenticate } = require('../middleware/auths');

// All cart routes require authentication
router.use(authenticate);

// Get user's cart
router.get('/', getCart);

// Add item to cart
router.post('/', addToCart);

// Update cart item quantity
router.put('/:id', updateCartItem);

// Remove item from cart
router.delete('/:id', removeFromCart);

// Clear entire cart
router.delete('/', clearCart);

module.exports = router;