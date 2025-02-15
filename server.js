const express = require("express");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");
const { sendOTP, verifyOTP } = require("./controller/otpController");
const userRouter = require("./routes/userRoutes.routes");

app.use(express.json());
app.use(cors());

app.use("/v1/api/", userRouter);

app.post("/send-otp", sendOTP); // Send OTP API

app.listen(3000, () => {
  console.log("Server started at port 3000");
});
