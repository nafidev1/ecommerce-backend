const express = require("express");
const {
  createCategory,
  getCategories,
  getCategory,
  searchCategories,
} = require("../controllers/categoryController");
const { verifyToken } = require("../utils/verifyToken");

const router = express.Router();

// CREATE
router.post("/", verifyToken, createCategory);

// GET ALL
// can take routes like /api/category/product?tags=apple,orange
router.get("/type/:categoryType", getCategories);

router.get("/search", searchCategories);

// GET
router.get("/:id", getCategory);

module.exports = router;
