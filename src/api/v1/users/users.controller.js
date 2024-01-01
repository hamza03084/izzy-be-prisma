const prisma = require("../../../prisma-client");
const bcrypt = require("bcryptjs");
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");
const { validateProfileSettings } = require("./user.validations");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PRICES = {
  month: process.env.MONTHLY_PRODUCT_PRICE,
  year: process.env.YEARLY_PRODUCT_PRICE
}
const PRODUCTS = {
  month: process.env.MONTHLY_PRODUCT_ID,
  year: process.env.YEARLY_PRODUCT_ID
}

exports.profileSettings = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { error, value } = validateProfileSettings.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 400));
  }
  const { password, ...rest } = value;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = { password: hashedPassword, ...rest };
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: userData,
  });
  delete user.password;
  res.status(201).json({ status: "success", user });
});

exports.loggedInUser = catchAsync(async (req, res, next) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } })
  delete user.password

  res.status(200).json({
    status: "success",
    user,
  })
})


exports.PaymentProcess = catchAsync(async (req, res,next) => {
  const email = req.body.email;
  const name = req.body.name;
  const seats = req.body.seats;
  const recurring = req.body.recurring; // month | year


  if (!seats || !email || !name | !recurring) {
    return next(new AppError("email, name, seats and recurring are required", 400));
  }
  if (!(recurring === "month" || recurring === "year")) {
    return next(new AppError("The value of 'recurring' must be month | year", 400));
  }

  const alreadyAvailPrices = await stripe.prices.search({
    query: `active:\'true\' AND lookup_key:\'${seats}_${recurring}ly\'`,
  });

  let priceId = "";
  if (alreadyAvailPrices.data.length) {
    priceId = alreadyAvailPrices.data[0].id
  } else {
    const price = await stripe.prices.create({
      product: PRODUCTS[recurring],
      unit_amount: (seats * PRICES[recurring]) * 100,
      currency: 'gbp',
      recurring: {
        interval: recurring,
      },
      lookup_key: `${seats}_${recurring}ly`,
    });
    priceId = price.id;
  }

  const customer = await stripe.customers.create({ email, name });

  const customerId = customer.id


  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{
      price: priceId,
    }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  });

  if (subscription.pending_setup_intent !== null) {
    res.send({
      type: 'setup',
      clientSecret: subscription.pending_setup_intent.client_secret,
    });
  } else {
    res.send({
      type: 'payment',
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  }
});



