const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createError } = require("../utils/createError");

module.exports.verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, "You are not authenticated"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); // in users models, we stored the id in jwt token, so we find user through it
    if (!user) {
      return next(createError(404, "No user found with this ID"));
    }
    const { password, ...filtered } = user._doc;
    req.user = { ...filtered };
    next();
  } catch (err) {
    console.log(err);
    return next(createError(401, "Invalid Token"));
  }
};

// for routes providing userID as params, verifies 
// only the owner itself can access that route
module.exports.verifyUser = async (req, res, next) => {
  await this.verifyToken(req, res, () => {
    if (req.user?._id.equals(req.params.id)) {
      next();
    } else {
      return next(createError(403, "Not Authorized"));
    }
  })
}