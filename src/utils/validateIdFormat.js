
const AppError = require("./appError");

const validateIdFormat = (id) => {
  if (!/^[1-9]\d*$/.test(id)) {
    throw new AppError("Invalid ID format", 400);
  }
};

module.exports = validateIdFormat;
