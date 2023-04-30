const Payment = require("../models/Payment");
const { emptyCart } = require("./cartController");

const stripe = require("stripe")(process.env.STRIPE_API_KEY);

module.exports.initPayment = async (req, res, next) => {
  try {
    const total = req.body.total;
    const payment = await stripe.paymentIntents.create({
      amount: total * 100,
      currency: "usd",
    });

    res.status(200).json({ clientSecret: payment.client_secret });
  } catch (error) {
    next(error);
  }
};

const registerPayment = async (
  category,
  quantity,
  buyer,
  description,
  latLong
) => {
  const seller = category.owner;
  const savedPayment = new Payment({
    buyer,
    seller,
    category,
    quantity,
    status: "Paid",
    description,
    latitude: latLong[0].toString(),
    longitude: latLong[1].toString(),
  });
  await savedPayment.save();
};

module.exports.createPayment = async (req, res, next) => {
  const latLong = req.body.values.location.split(",");
  try {
    req.body.cart.map(async (cartItem) => {
      await registerPayment(
        cartItem.category,
        cartItem.quantity,
        req.user._id,
        req.body.values.description,
        latLong
      );
    });
    await emptyCart(req.user._id);
    res.status(200).json(req.body);
  } catch (error) {
    next(error);
  }
};

module.exports.getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ buyer: req.user._id }).populate(
      "category"
    );
    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

module.exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Payment.find({ seller: req.user._id }).populate(
      "category"
    );
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports.getStripePublishabelKey = (req, res, next) => {
  try {
    const key = process.env.STRIPE_PUBLISHABLE_KEY;
    res.status(200).json(key);
  } catch (error) {
    next(error);
  }
};
