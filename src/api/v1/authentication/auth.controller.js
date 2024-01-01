const bcrypt = require("bcryptjs");

const prisma = require("../../../prisma-client");
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");
const { signToken } = require("../../../utils/signToken");
const {
  validateLogin,
  validateUser,
  validateEmail,
} = require("./auth.validation");

exports.loginUser = catchAsync(async (req, res, next) => {
  const { error, value } = validateLogin.validate(req.body);

  if (error) {
    return next(new AppError(error.message, 400));
  }

  const { email, password } = value;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return next(new AppError("invalid email or password", 401));
  }

  if (user.resetToken || user.resetTokenExpiresAt) {
    return next(new AppError("check your email and reset password", 401));
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError("invalid email or password", 401));
  }

  const token = signToken(user.id, user.email);

  delete user.password;

  res.status(200).json({ message: "Login successful", user, token });
});

exports.register = catchAsync(async (req, res, next) => {
  const { error, value } = validateUser.validate(req.body);

  if (error) {
    return next(new AppError(error.message, 400));
  }

  const { password, ...rest } = value;

  const hashedPassword = await bcrypt.hash(password, 10);

  const userData = { password: hashedPassword, ...rest };

  const user = await prisma.user.create({
    data: userData,
  });

  const token = signToken(user.id, user.email);

  delete user.password;

  res
    .status(201)
    .json({ status: "success", message: "User created!", token, user });
});
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const { error, value } = validateEmail.validate({ email });

  if (error) {
    return next(new AppError(error.message, 400));
  }

  const user = await prisma.user.findFirst({ where: { email: value.email } });
  if (user) {
    return next(new AppError("This email already exists!", 409));
  }

  res.status(200).json({ status: "success" });
});
