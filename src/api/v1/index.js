const express = require("express");
const authentication = require("./authentication/index");
const invoiceRouter = require("./invoices");
const xeroRouter = require("./xero");
const emailRouter = require("./email");
const userRouter = require("./users");
const chaserTemplateRouter = require("./chaserTemplate");
const emailChaserRouter = require("./emailChaser");
const templateWithInvoiceRouter = require("./templateWithInvoice");
const clientRouter = require("./client");
const { authenticateUser } = require("../../middleware/auth");
const {
  resetPassword,
  forgotPassword,
} = require("./resetPassword/resetPassword.controller");

const router = express.Router();

router.use("/auth", authentication);
router.use("/invoices", authenticateUser, invoiceRouter);
router.use("/xero", xeroRouter);
router.use("/send-email", emailRouter);
router.use("/user", userRouter);
router.use("/chaser-template", chaserTemplateRouter);
router.use("/email-chaser", emailChaserRouter);

router.post("/reset-password/:token", resetPassword);
router.post("/forgot-password", forgotPassword);
router.use("/template-invoice", templateWithInvoiceRouter);
router.use("/client", clientRouter);

module.exports = router;




