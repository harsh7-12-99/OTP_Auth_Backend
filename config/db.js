require('dotenv').config();
const mysql = require("mysql2");

const db = mysql.createPool({
  host: '44.211.172.151',
  user: 'root',
  password: 'Harsh@1999',
  database: 'test_db',
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

module.exports = db;
