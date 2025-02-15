const express = require("express");
const router = express.Router();
const dataController = require("../controller/data.controller");
const otpController = require("../controller/otpController")

router.get("/get-user/", dataController.getUserController);

// body just has the email
router.post("/register-email/",otpController.sendOTP)

// body will only have email and otp
router.post("/verify-otp",otpController.verifyOTP)

module.exports = router;
