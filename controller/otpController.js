const { redisClient } = require("../config/db");


// Function to generate a 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000); // Ensures 4 digits
};

// API to generate and store OTP in Redis
const sendOTP = (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const otp = generateOTP();
  const key = `otp:${username}`;
  const ttl = 300; // 5 minutes expiry

  redisClient.setEx(key, ttl, otp, (err, reply) => {
    if (err) {
      console.error("❌ Redis Set Error:", err);
      return res.status(500).json({ error: "Failed to store OTP" });
    }
    console.log(`✅ OTP ${otp} stored for ${username}`);
    res.json({ message: "OTP sent successfully", otp }); // Remove OTP in prod
  });
};

// API to verify OTP
const verifyOTP = (req, res) => {
  const { username, otp } = req.body;

  if (!username || !otp) {
    return res.status(400).json({ error: "Username and OTP are required" });
  }

  const key = `otp:${username}`;

  redisClient.get(key, (err, storedOTP) => {
    if (err) {
      console.error("❌ Redis Get Error:", err);
      return res.status(500).json({ error: "Failed to verify OTP" });
    }

    if (!storedOTP) {
      return res.status(400).json({ error: "OTP expired or not found" });
    }

    if (storedOTP === otp) {
      redisClient.del(key); // Delete OTP after successful verification
      return res.json({ message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ error: "Invalid OTP" });
    }
  });
};

module.exports = { sendOTP, verifyOTP };
