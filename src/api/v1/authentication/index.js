const express = require("express");
const { loginUser, register, verifyEmail } = require("./auth.controller");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", register);
router.post("/verify-email", verifyEmail);

module.exports = router;
