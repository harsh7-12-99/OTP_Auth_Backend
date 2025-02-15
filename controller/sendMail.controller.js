require("dotenv").config();

const nodemailer = require("nodemailer");

const sendEmail = async (recipientEmail, subject, message) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `"Hamari Company" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: subject,
      text: message,
    });

    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
