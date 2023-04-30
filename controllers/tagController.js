const Tag = require("../models/Tag");

module.exports.addTagWithCategory = async (tags, category) => {
  for (let tag of tags) {
    const foundTag = await Tag.findOne({
      $and: [{ tag }, { type: category.type }],
    });
    if (!foundTag) {
      // if completely new tag
      const newTag = new Tag({
        tag,
        categories: category,
        type: category.type,
      });
      await newTag.save();
    } else {
      // if old tag, then just push categoryId
      await Tag.findByIdAndUpdate(foundTag._id, {
        $push: { categories: category },
      });
    }
  }
};

module.exports.getTags = async (req, res, next) => {
  try {
    const categoryType = req.query.categoryType;
    const tags = await Tag.find({ type: categoryType });
    res.status(200).json(tags);
  } catch (error) {
    next(errror);
  }
};
