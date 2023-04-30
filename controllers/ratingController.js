const Category = require("../models/Category");
const Rating = require("../models/Rating");

module.exports.getUserRating = async (req, res, next) => {
  let rating;
  try {
    const ratingFound = await Rating.findOne({
      $and: [
        { owner: req.user._id.toString() },
        { category: req.query.categoryId },
      ],
    });
    if (!ratingFound) rating = 0;
    else rating = ratingFound.rating;

    res.status(200).json({ rating });
  } catch (error) {
    next(error);
  }
};

const addRatingToCategory = async (categoryId, rating) => {
  const category = await Category.findById(categoryId);
  const newRating = (category.numberOfLikes + rating) / 2;
  await Category.findByIdAndUpdate(categoryId);
  await Category.findByIdAndUpdate(
    categoryId,
    { numberOfLikes: newRating },
    { new: true }
  );
};

module.exports.createUserRating = async (req, res, next) => {
  const { rating, categoryId } = req.body;

  try {
    const ratingFound = await Rating.findOne({
      $and: [{ owner: req.user._id }, { category: categoryId }],
    });
    let newRating = undefined;

    if (ratingFound) {
      newRating = await Rating.findByIdAndUpdate(
        ratingFound._id,
        { rating },
        { new: true }
      );
    } else {
      newRating = new Rating({
        rating,
        owner: req.user._id,
        category: categoryId,
      });
      await newRating.save();
    }

    await addRatingToCategory(categoryId, rating);

    res.status(200).json({ ...newRating._doc });
  } catch (error) {
    next(error);
  }
};
