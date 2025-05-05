// models/Product.js
const { DataTypes } = require("sequelize");
const db = require("../config/database");
const Category = require("./Category");

const Product = db.define("Product", {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  image: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Define relation
Product.belongsTo(Category);
Category.hasMany(Product);

module.exports = Product;