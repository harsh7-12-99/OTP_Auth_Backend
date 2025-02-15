const db = require("../config/db");

function getAllUsers(callback) {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return callback(err, null);
    return callback(null, results);
  });
}
function checkUserExists(username, email, callback) {
  db.query(
    "SELECT COUNT(*) as count FROM users WHERE username = ? AND email = ?",
    [username, email],
    (err, results) => {
      if (err)return callback(err, null);
      return callback(null, results[0].count > 0);
    }
  );
}

function addNewUser(username, email, password, callback) {
  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password],
    callback
  );
}

module.exports = {
  getAllUsers,
  addNewUser,
  checkUserExists,
};
