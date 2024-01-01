const Joi = require("joi");

const validateLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
const validateEmail = Joi.object({
  email: Joi.string().email().required(),
});

const validateUser = Joi.object({
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).required(),
  businessName: Joi.string(),
  companySize: Joi.string(),
  industry: Joi.string(),
  teamMembers: Joi.array().items(Joi.string().email()),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = { validateLogin, validateUser, validateEmail };
