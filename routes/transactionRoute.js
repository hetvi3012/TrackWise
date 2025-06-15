// routes/transactionRoute.js

const express = require("express");
const {
  addTransaction,
  getAllTransaction,
  editTransaction,
  deleteTransaction
} = require("../controllers/transactionctrl");
const { predictCategory } = require("../controllers/categoryController");
const { parseDescription } = require("../controllers/nlpController");

const router = express.Router();

// Add a new transaction
router.post("/add-transaction", addTransaction);

// Edit an existing transaction
router.post("/edit-transaction", editTransaction);

// Delete a transaction
router.post("/delete-transaction", deleteTransaction);

// Get transactions (with filters)
router.post("/get-transaction", getAllTransaction);

// AI-powered category prediction for a given description
router.post("/predict-category", predictCategory);

// NLP-based free-text parser (amount, date, vendor)
router.post("/parse-description", parseDescription);

module.exports = router;
