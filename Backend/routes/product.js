// routes/products.js
import express from "express";
const router = express.Router();
const { getProducts, createProduct } = require("../controllers/productController");

router.get("/", getProducts);
router.post("/", createProduct);

module.exports = router;