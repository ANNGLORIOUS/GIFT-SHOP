// File: server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "../config/db.js";
import productRoutes from "../routes/product.js";
import categoryRoutes from "../routes/category.js";
import userRoutes from "../routes/users.js";
import orderRoutes from "../routes/orders.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Ensure the DB is synced before starting the server
db.sync()
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error("Sync Error:", err));
