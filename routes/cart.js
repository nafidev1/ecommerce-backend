const { Router } = require("express");
const express = require("express");
const { createCart, getCartItems } = require("../controllers/cartController");
const { verifyToken } = require("../utils/verifyToken");

const router = express.Router();

// CREATE
router.post("/", verifyToken, createCart);

// GET ALL
router.get("/", verifyToken, getCartItems);

module.exports = router;
