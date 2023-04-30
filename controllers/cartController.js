const Cart = require("../models/Cart");
const { createError } = require("../utils/createError");
const { findCategoryById } = require("./categoryController");

const updateJustQuantity = async (cart, categoryId, quantity) => {
  await Cart.findOneAndUpdate(
    { cart: cart._id, "categories.category": categoryId },
    {
      $set: {
        "categories.$.quantity": quantity,
      },
    },
    { $new: true }
  );
  return await Cart.findOne(cart._id).populate({
    path: "categories.category",
    model: "Category",
  });
};

const addCartItem = async (cartId, newCategory, newQuantity) => {
  const category = {
    category: newCategory,
    quantity: newQuantity,
  };
  return await Cart.findByIdAndUpdate(
    cartId,
    { $push: { categories: category } },
    { new: true }
  ).populate({
    path: "categories.category",
    model: "Category",
  });
};

const createNewCartItem = async (ownerId, newCategory, newQuantity) => {
  const newCart = new Cart({
    owner: ownerId,
    categories: [{ category: newCategory, quantity: newQuantity }],
  });
  await newCart.save();
  savedCart = await Cart.findOne({ _id: newCart._id }).populate({
    path: "categories.category",
    model: "Category",
  });
  return savedCart;
};

module.exports.createCart = async (req, res, next) => {
  let savedCart;
  try {
    const category = await findCategoryById(req.body.category);
    if (category && req.body.quantity > category.quantity)
      return next(createError(404, "Exceeds quantity available by seller"));
    if (req.user._id.toString() === category.owner.toString())
      return next(createError(404, "Cannot buy item you added"));

    const foundCart = await Cart.findOne({ owner: req.user._id });

    if (foundCart) {
      if (
        foundCart.categories.find((cat) =>
          cat.category.equals(req.body.category)
        )
      ) {
        const finalRes = await updateJustQuantity(
          foundCart,
          req.body.category,
          req.body.quantity
        );
        return res.status(200).json(finalRes);
      }

      savedCart = await addCartItem(
        foundCart._id,
        req.body.category,
        req.body.quantity
      );
    } else {
      savedCart = await createNewCartItem(
        req.user._id,
        req.body.category,
        req.body.quantity
      );
    }
    res.status(200).json(savedCart);
  } catch (error) {
    next(error);
  }
};

module.exports.getCartItems = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ owner: req.user._id }).populate({
      path: "categories.category",
      model: "Category",
    });
    res.status(200).json(cart?.categories || []);
  } catch (error) {
    next(error);
  }
};

module.exports.emptyCart = async (ownerId) => {
  await Cart.deleteMany({ owner: ownerId });
};
