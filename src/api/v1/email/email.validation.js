const Joi = require("joi");

const validateEmail = Joi.object({
  subject: Joi.string().allow(''),
  email: Joi.string().email().required(),
  body: Joi.string().required(),
  schedule: Joi.date().allow(''),
});

module.exports = { validateEmail };
