// models/Category.js
const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Category = db.define("Category", {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
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

module.exports = Category;