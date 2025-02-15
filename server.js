require('dotenv').config();
const express = require("express");
const mysql = require('mysql2');

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT
// });

const connection = mysql.createConnection({
  host: '44.211.172.151',
  user: 'root',
  password: 'Harsh@1999',
  database: 'test_db',
  connectTimeout: 10000, // Increase timeout to handle network delays
});

const app = express();
const {
  getAllUsers,
  addNewUser,
  checkUserExists,
} = require("./model/data.model");

app.use(express.json());

app.get("/", (req, res) => {
  getAllUsers((err, users) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    return res.status(200).json(users);
  });
});

app.post("/", (req, res) => {
  let data = req.body;
  if (!data.name || !data.email || !data.password) {
    return res.status(400).json({ message: "Please enter all the details" });
  }
  checkUserExists(data.name, data.email, (err, exists) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    addNewUser(data.name, data.email, data.password, (err, newUser) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      return res
        .status(200)
        .json({ newUser, message: "Data added successfully" });
    });
  });
});
app.listen(3000, () => {
  console.log("Server started at port 3000");
});

module.exports = connection;
