// File: routes/categories.js
import express from "express";
const router = express.Router();
const { getCategories } = require("../controllers/categoryController");

router.get("/", getCategories);

module.exports = router;