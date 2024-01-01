const nodemailer = require("nodemailer")
const AppError = require("./appError")

const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const mailOptions = {
    from: `${process.env.EMAIL_USERNAME}`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Email Sent! 🚀");
  } catch (error) {
    console.log(error, "error in email");
  }
}

module.exports = sendEmail
