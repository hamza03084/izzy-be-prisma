const express = require("express");
const {
  createTemplateInvoice,
  getTemplateInvoices,
} = require("./templateWithInvoice.controller");
const router = express.Router();
router.route("/").post(createTemplateInvoice).get(getTemplateInvoices);
module.exports = router;
