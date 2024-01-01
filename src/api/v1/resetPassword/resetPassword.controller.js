const prisma = require("../../../prisma-client");
const bcrypt = require("bcryptjs");
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");
const crypto = require("crypto");
const sendEmail = require("../../../utils/email");
const {
  validateForgotPassword,
  validateResetPassword,
} = require("./resetPassword.validations");

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { error, value } = validateForgotPassword.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 400));
  }

  const user = await prisma.user.findFirst({
    where: { email: value.email },
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: hashedResetToken,
      resetTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  const resetURL = `${req.protocol}://izzy-ar.aime.works/reset-password/${hashedResetToken}`;

  const subject = "Password Reset Request";
  const body = `Dear ${user.firstName},\n\nYou (or someone else) has requested a password reset. Please click on the following link to reset your password:\n\n${resetURL}\n\nIf you did not request this, please ignore this email.`;

   sendEmail({
    email: user.email,
    subject,
    message: body,
  });

  res.status(200).json({ status: "success", message: "Token sent to email" });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { error, value } = validateResetPassword.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 400));
  }

  const { token } = req.params;

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiresAt: { gte: new Date() },
    },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  const hashedPassword = await bcrypt.hash(value.password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  });

  res
    .status(200)
    .json({ status: "success", message: "Password reset successful" });
});
