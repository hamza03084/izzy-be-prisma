const Joi = require("joi");

const validateForgotPassword = Joi.object({
  email: Joi.string().email().required(),
});
const validateResetPassword = Joi.object({
  password: Joi.string().min(6).required(),
});

module.exports = { validateForgotPassword, validateResetPassword };
