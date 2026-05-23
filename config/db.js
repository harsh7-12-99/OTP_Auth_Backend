require("dotenv").config();
const mysql = require("mysql2/promise");
const redis = require("redis");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Max connections
  queueLimit: 0,
  connectTimeout: 10000, // Increase timeout to handle network delays
});

const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log("Database connected successfully");
    connection.release();
  } catch (err) {
    console.error("Database connection failed:", err);
  }
};

testConnection();

const redisClient = redis.createClient({
  socket: {
    host: "127.0.0.1", // Update with your Redis server IP
    port: 6379,
  },
});

(async () => {
  try {
    await redisClient.connect();
    console.log("✅ Connected to Redis");
  } catch (err) {
    console.error("❌ Redis Connection Error:", err);
  }
})();

module.exports = { db, redisClient };
