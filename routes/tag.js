const express = require("express");
const { getTags } = require("../controllers/tagController");

const router = express.Router();

// GET ALL
// responds like so /api/tag/?categoryType=product
router.get("/", getTags);

module.exports = router;