// middleware/validators.js
const { body, validationResult } = require('express-validator');

// Validation result middleware
exports.validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User registration validation
exports.registerValidation = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Login validation
exports.loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
];

// Product validation
exports.productValidation = [
  body('name').not().isEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('categoryId').isInt().withMessage('Category ID must be an integer')
];

// Category validation
exports.categoryValidation = [
  body('name').not().isEmpty().withMessage('Category name is required')
];

// Order validation
exports.orderValidation = [
  body('products').isArray().withMessage('Products must be an array'),
  body('products.*.id').isInt().withMessage('Product ID must be an integer'),
  body('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress').not().isEmpty().withMessage('Shipping address is required')
];