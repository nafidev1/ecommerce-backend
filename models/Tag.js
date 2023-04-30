const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: [true, "Tag is required"],
  },
  type: {
    type: String,
    required: [true, "Category Type required"],
  },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

const Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;
