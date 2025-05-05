// routes/categories.js
const express = require('express');
const router = express.Router();
const { 
  getCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/categoryController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { categoryValidation, validateResult } = require('../middleware/validators');

// Get all categories (public)
router.get('/', getCategories);

// Get category by ID with products (public)
router.get('/:id', getCategoryById);

// Create category (admin only)
router.post(
  '/', 
  authenticate, 
  isAdmin, 
  categoryValidation, 
  validateResult, 
  createCategory
);

// Update category (admin only)
router.put(
  '/:id', 
  authenticate, 
  isAdmin, 
  categoryValidation, 
  validateResult, 
  updateCategory
);

// Delete category (admin only)
router.delete('/:id', authenticate, isAdmin, deleteCategory);

module.exports = router;