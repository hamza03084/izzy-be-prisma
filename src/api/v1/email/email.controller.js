const catchAsync = require("../../../utils/catchAsync");
const sendEmail = require("../../../utils/email");
const cron = require("node-cron");
const moment = require("moment");
const { validateEmail } = require("./email.validation");
const AppError = require("../../../utils/appError");

exports.sendMail = catchAsync(async (req, res, next) => {
  const { error, value } = validateEmail.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 400));
  }
  const { subject, email, body, schedule } = value;
  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Email Received</title>
    </head>
    <body>
      <br />
      <div style="display: flex; flex-direction: column; gap: 8px">
        <span>${body}</span>
      </div>
    </body>
  </html>  
    `;
  if (schedule) {
    const cronExpression = moment(schedule).format("m H D M *");
    cron.schedule(cronExpression, () => {
      sendEmail({
        email,
        subject,
        message: htmlContent,
      });
    });
  } else {
    sendEmail({
      email,
      subject,
      message: htmlContent,
    });
  }

  res.status(200).json({ status: "success", message: "email send" });
});