const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createError } = require("../utils/createError");

module.exports.signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hash,
    });

    const user = await newUser.save();
    const { password, ...filteredUser } = user._doc;
    console.log({ ...filteredUser });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res
      .cookie(
        "access_token",
        token,
        { httpOnly: true, sameSite: 'none', secure: true, domain: 'ecommerce-app-0nel.onrender.com' },
        {
          expires: new Date(Date.now() + 25892000000), // set expiry of 1month
        }
      )
      .status(201)
      .json({ ...filteredUser });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "Wrong email or password"));
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(404, "Wrong email or password"));

    const { password, ...filteredUser } = user._doc;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res
      .cookie(
        "access_token",
        token,
        { httpOnly: true, sameSite: 'none', secure: true, domain: 'ecommerce-app-0nel.onrender.com' },
        {
          expires: new Date(Date.now() + 25892000000), // set expiry of 1month
        }
      )
      .status(200)
      .json({ ...filteredUser });
  } catch (error) {
    next(error);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User Logged out");
  } catch (error) {
    next(error);
  }
};
