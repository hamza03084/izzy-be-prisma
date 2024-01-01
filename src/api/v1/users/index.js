const express = require("express");
const { profileSettings, loggedInUser, PaymentProcess } = require("./users.controller");
const { authenticateUser } = require("../../../middleware/auth");

// const { authenticateUser } = require("../../../middleware/auth");

const router = express.Router();

router.patch("/profile/:id",authenticateUser, profileSettings);
router.get("/me", authenticateUser,loggedInUser);
router.post("/payment-process",PaymentProcess);

module.exports = router;
