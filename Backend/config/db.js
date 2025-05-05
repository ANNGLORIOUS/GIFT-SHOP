// config/database.js
const { Sequelize } = require("sequelize");

const db = new Sequelize("your_database_name", "your_db_user", "your_db_password", {
  host: "localhost",
  dialect: "postgres",
  logging: false, // set to true if you want SQL logs
});

module.exports = db;
