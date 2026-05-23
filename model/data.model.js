const { db } = require("../config/db");
const bcrypt = require("bcrypt");

function getAllUsers(callback) {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return callback(err, null);
    return callback(null, results);
  });
}
function checkUserExists(objReqBodyData, callback) {
  db.query(
    "SELECT COUNT(*) as count FROM users WHERE email = ?",
    [objReqBodyData.email],
    (err, results) => {
      if (err) return callback(err, null);
      return callback(null, results[0].count > 0);
    }
  );
}

async function addNewUser(objReqBodyData, callback) {
  try {
    const { password } = objReqBodyData;
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.query(
      "INSERT INTO users (username, email, password, phone ) VALUES (?, ?, ?, ?)",
      [
        objReqBodyData.username,
        objReqBodyData.email,
        hashedPassword,
        objReqBodyData.phone,
      ],
      callback
    );
  } catch (err) {
    callback(err);
  }
}

module.exports = {
  getAllUsers,
  addNewUser,
  checkUserExists,
};
