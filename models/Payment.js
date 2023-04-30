const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  status: {
    type: String,
    required: [true, "Status required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity required"],
  },
  description: {
    type: String,
    required: [true, "Description required"],
  },
  latitude: {
    type: String,
    required: [true, "Latitude required"],
  },
  longitude: {
    type: String,
    required: [true, "Longitude required"],
  },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
