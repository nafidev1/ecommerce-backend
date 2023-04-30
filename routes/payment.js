const express = require("express");
const {
  initPayment,
  createPayment,
  getPayments,
  getOrders,
  getStripePublishabelKey,
} = require("../controllers/paymentController");
const { verifyToken } = require("../utils/verifyToken");

const router = express.Router();

router.post("/initialize", verifyToken, initPayment);
router.post("/create", verifyToken, createPayment);
router.get("/", verifyToken, getPayments);
router.get("/orders", verifyToken, getOrders);
router.get('/stripe_publishable_key', getStripePublishabelKey);

module.exports = router;
