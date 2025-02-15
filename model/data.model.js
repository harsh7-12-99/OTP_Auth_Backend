const { db } = require("../config/db");

function getAllUsers(callback) {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return callback(err, null);
    return callback(null, results);
  });
}
function checkUserExists(objReqBodyData, callback) {
  db.query(
    "SELECT COUNT(*) as count FROM users WHERE username = ? AND email = ?",
    [objReqBodyData.email],
    (err, results) => {
      if (err) return callback(err, null);
      return callback(null, results[0].count > 0);
    }
  );
}

function addNewUser(objReqBodyData, callback) {
  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [objReqBodyData.username, objReqBodyData.email, objReqBodyData.password],
    callback
  );
}

module.exports = {
  getAllUsers,
  addNewUser,
  checkUserExists,
};
