const { redisClient } = require("../config/db");
const dataController = require("../controller/data.controller");
const sendEmail = require("../controller/sendMail.controller")


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
          });        console.log(`✅ OTP stored for ${username}`);
      } catch (error) {
        console.error(`❌ Error storing OTP for ${username}:`, error);
      }
  }

// API to generate and store OTP in Redis
const sendOTP = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Username is required" });
  }

  dataController.checkUserExists(req.body,(err,result)=> {if(result){return res.status(400).json({message:"user exists"})}})

  const otp = generateOTP();

  // sending the email
  

  if(sendEmail(email,"OTP",String(otp)))
   { storeOtp(email,otp); }



  return res.status(200).json({ message: "OTP sent successfully" });
};


const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    // Ensure Redis client is connected
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    // Retrieve OTP from Redis
    const storedOTP = await redisClient.get(email);

    if (!storedOTP) {
      return res.status(400).json({ error: "OTP expired or not found" });
    }

    if (storedOTP === otp) {
      // Delete OTP after successful verification
      await redisClient.del(email);

      // Register the user in the database
      await dataController.addUserController(req, res);

      return res.json({ message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (err) {
    console.error("❌ Redis Get Error:", err);
    return res.status(500).json({ error: "Failed to verify OTP" });
  }
};



module.exports = { sendOTP, verifyOTP };
