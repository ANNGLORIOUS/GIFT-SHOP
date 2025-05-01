// models/Product.js
const { DataTypes } = require("sequelize");
const db = require("../config/database");
const Category = require("./Category");

const Product = db.define("Product", {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  image: { type: DataTypes.STRING },
});

Product.belongsTo(Category);
Category.hasMany(Product);

module.exports = Product;