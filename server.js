const express = require("express");
const app = express();
const { getAllUsers, addNewUser } = require("./model/data.model");

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
  addNewUser(
    req.body.name,
    req.body.email,
    req.body.password,
    (err, newUser) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      return res
        .status(200)
        .json({ newUser, message: "Data added successfully" });
    }
  );
});
app.listen(3000, () => {
  console.log("Server started at port 3000");
});
