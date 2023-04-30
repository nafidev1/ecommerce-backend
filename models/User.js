const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "email is required. "],
    validate: [validator.isEmail, 'Invalid email format. '],
    lowercase: true,
    unique: [true, "email already taken. "],
  },
  phone: {
    type: String,
    required: [true, "number is required. "],
    match: [/^\d{8}$/, "phone number format invalid. "],
  },
  password: {
    type: String,
    required: [true, "password is required. "],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
