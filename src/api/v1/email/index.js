const express = require("express");
const { sendMail } = require("./email.controller");
const router = express.Router();
router.route("/").post(sendMail);
module.exports = router;