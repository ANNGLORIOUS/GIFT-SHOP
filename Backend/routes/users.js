// routes/users.js
const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getProfile, 
  updateProfile 
} = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { 
  registerValidation, 
  loginValidation,
  validateResult 
} = require('../middleware/validators');

// Register a new user
router.post('/register', registerValidation, validateResult, registerUser);

// Login user
router.post('/login', loginValidation, validateResult, loginUser);

// Get user profile (protected)
router.get('/profile', authenticate, getProfile);

// Update user profile (protected)
router.put('/profile', authenticate, updateProfile);

module.exports = router;