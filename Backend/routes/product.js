// routes/products.js
const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { productValidation, validateResult } = require('../middleware/validators');

// Get all products (public)
router.get('/', getProducts);

// Get product by ID (public)
router.get('/:id', getProductById);

// Create product (admin only)
router.post(
  '/', 
  authenticate, 
  isAdmin, 
  productValidation, 
  validateResult, 
  createProduct
);

// Update product (admin only)
router.put(
  '/:id', 
  authenticate, 
  isAdmin, 
  productValidation, 
  validateResult, 
  updateProduct
);

// Delete product (admin only)
router.delete('/:id', authenticate, isAdmin, deleteProduct);

module.exports = router;