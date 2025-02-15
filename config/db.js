const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Chiku",
  database: "express_db",
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed: ", err);
    return;
  }
  console.log("Database connected successfully");
});

module.exports = db;
