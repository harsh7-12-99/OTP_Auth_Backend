const express = require("express");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");
const { sendOTP, verifyOTP } = require("./controller/otpController");
const sendEmail = require("./controller/sendMail.controller");
const userRouter = require("./routes/userRoutes.routes");

app.use(express.json());
app.use(cors());

app.use("/v1/api/", userRouter);

app.post("/send-otp", sendOTP); // Send OTP API
app.post("/send-email", async (req, res) => {
  const { recipientEmail, subject, message } = req.body;

  // Validate input
  if (!recipientEmail || !subject || !message) {
    return res.status(400).json({ error: "Please provide all fields." });
  }

  try {
    // Send email
    await sendEmail(recipientEmail, subject, message);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email." });
  }
});
app.listen(3000, () => {
  console.log("Server started at port 3000");
});
