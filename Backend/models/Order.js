//models/Order.js
const { DataTypes } = require("sequelize");
const db = require("../config/database");
const User = require("./User");

const Order = db.define("Order", {
  total: { type: DataTypes.FLOAT, allowNull: false },
});

Order.belongsTo(User);
User.hasMany(Order);

module.exports = Order;