// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const {sequelize} = require('../config/db');
const { notFound, errorHandler } = require('../middleware/errorHandler');

// Import routes
const productRoutes = require('../routes/product');
const categoryRoutes = require('../routes/category');
const userRoutes = require('../routes/users');
const orderRoutes = require('../routes/orders');
const cartRoutes = require('../routes/cart');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Soleil Jewelry API' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Sync database and start server
sequelize.sync()
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection error:', err));

module.exports = app;