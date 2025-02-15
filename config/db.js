require('dotenv').config();
const mysql = require("mysql2");
const redis = require("redis");


const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,  // Max connections
  queueLimit: 0,
  connectTimeout: 10000, // Increase timeout to handle network delays
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed: ", err);
    return;
  }
  console.log("Database connected successfully");
  connection.release(); // Release connection after testing
});

const redisClient = redis.createClient({
  host: "44.211.172.151", // Redis server host
  port: 6379, // Default Redis port
});


redisClient.on("connect", () => console.log("✅ Redis connected"));
redisClient.on("error", (err) => console.error("❌ Redis Error:", err));

module.exports = { db, redisClient };