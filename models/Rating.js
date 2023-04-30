const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    default: 0,
    required: [true, "Rating required"],
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;