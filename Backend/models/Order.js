// models/Order.js
const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/db");
const User = require("./User");

const Order = sequelize.define("Order", {
  total: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  paymentMethod: {
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

Order.belongsTo(User);
User.hasMany(Order);

module.exports = Order;