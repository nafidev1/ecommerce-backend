const express = require("express");
const {
  createUserRating,
  getUserRating,
} = require("../controllers/ratingController");
const { verifyToken } = require("../utils/verifyToken");
const router = express.Router();

// CREATE
router.post("/", verifyToken, createUserRating);

// GET
router.get("/", verifyToken, getUserRating);

module.exports = router;
