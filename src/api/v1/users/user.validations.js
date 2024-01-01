const Joi = require("joi");
const validateProfileSettings = Joi.object({
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).required(),
  businessName: Joi.string(),
  companySize: Joi.string(),
  industry: Joi.string(),
  teamMembers: Joi.array().items(Joi.string().email()),
  password: Joi.string().min(6).required(),
});

module.exports = { validateProfileSettings };
