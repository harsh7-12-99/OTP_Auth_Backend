const {
  getAllUsers,
  addNewUser,
  checkUserExists,
} = require("../model/data.model");

const getUserController = (req, res) => {
  getAllUsers((err, users) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    return res.status(200).json(users);
  });
};

const addUserController = (req, res) => {
  let data = req.body;
  if (!data.username || !data.email || !data.password) {
    return res.status(400).json({ message: "Please enter all the details" });
  }
  checkUserExists(data, (err, exists) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Database error due to exists check" });

    if (exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    addNewUser(data, (err, newUser) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database error due to adding new user" });
      }
      return res
        .status(200)
        .json({ newUser, message: "Data added successfully" });
    });
  });
};

module.exports = {
  getUserController,
  addUserController,
  checkUserExists,
};
