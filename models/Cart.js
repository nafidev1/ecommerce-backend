const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  categories: [
    {
      category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
      quantity: { type: Number, required: [true, "Quantity required"] },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
