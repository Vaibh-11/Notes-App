const jwt = require("jsonwebtoken");
const connection = require("../config/databaseConnection");
module.exports.userAuth = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    const decode = jwt.verify(token, process.env.JWT_KEY);

    const findByEmail = "Select * from users where email=?";

    const [rows] = await connection.query(findByEmail, [decode.email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const users = rows[0];

    req.user = users;

    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
