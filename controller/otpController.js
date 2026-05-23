const { redisClient } = require("../config/db");
const dataController = require("../controller/data.controller");
const { addNewUser } = require("../model/data.model");
const sendEmail = require("../controller/sendMail.controller");

// Function to generate a 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000); // Ensures 4 digits
};

async function storeOtp(username, otp) {
  try {
    // Ensure Redis is connected before executing commands
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    // Store OTP with a 5-minute expiry (300 seconds)
    await redisClient.set(username, otp, {
      EX: 300,
    });
  } catch (error) {
    console.error(`❌ Error storing OTP for ${username}:`, error);
  }
}

// API to generate and store OTP in Redis
const sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Wait for result from checkUserExists
  try {
    const userExists = await new Promise((resolve, reject) => {
      dataController.checkUserExists(req.body, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOTP();

    const emailSent = await sendEmail(email, "OTP", String(otp));

    if (emailSent) {
      await storeOtp(email, otp);
      return res.status(200).json({ message: "OTP sent successfully" });
    } else {
      return res.status(500).json({ error: "Failed to send email" });
    }
  } catch (error) {
    console.error("❌ sendOTP error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    const storedOTP = await redisClient.get(email);

    if (!storedOTP) {
      return res.status(400).json({ error: "OTP expired or not found" });
    }

    if (storedOTP === otp) {
      await redisClient.del(email);

      addNewUser(req.body, (err, newUser) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Database error while adding user" });
        }
        return res
          .status(200)
          .json({ message: "OTP verified and user added", newUser });
      });
    } else {
      return res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (err) {
    console.error("❌ Redis Get Error:", err);
    return res.status(500).json({ error: "Failed to verify OTP" });
  }
};

module.exports = { sendOTP, verifyOTP };
