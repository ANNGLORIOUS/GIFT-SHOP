// File: server.js
const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const userRoutes = require("./routes/users");
const orderRoutes = require("./routes/orders");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
db.sync().then(() => {
  console.log("Database synced");
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}).catch(err => console.error("Sync Error:", err));