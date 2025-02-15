const db = require("../config/db");

function getAllUsers(callback) {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return callback(err, null);
    return callback(null, results);
  });
}
function checkUserExists(name, email, callback) {
  db.query(
    "SELECT COUNT(*) as count FROM users WHERE name = ? AND email = ?",
    [name, email],
    (err, results) => {
      if (err) return callback(err, null);
      return callback(null, results[0].count > 0);
    }
  );
}

function addNewUser(name, email, password, callback) {
  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    callback
  );
}

module.exports = {
  getAllUsers,
  addNewUser,
  checkUserExists,
};
