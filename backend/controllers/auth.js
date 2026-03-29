const connection = require("../config/databaseConnection.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.userSignUp = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(name)) {
      return res.status(400).json({
        message: "Name must contain only alphabets",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const insert =
      "Insert into users (name,email,password,role) values (?,?,?,?)";
    const [result] = await connection.query(insert, [
      name,
      email,
      hashPassword,
      role || "viewer",
    ]);

    res.status(200).json({ message: "User added successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const findByEmail = "Select * from users where email = ?";
    const [rows] = await connection.query(findByEmail, [email]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const user = rows[0];

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_KEY, {
      expiresIn: "2h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2,
      secure: false,
      path: "/",
    });

    res.status(200).json({ message: `Welcome${user.name}`, token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.getLogInUser = async (req, res) => {
  const users = req.user;

  res.send(users);
};

module.exports.userLogout = (req, res) => {
  try {
    res.clearCookie("token", {
      path: "/",
    });

    res.cookie("token", "", {
      expires: new Date(0),
      path: "/",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
      error,
    });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const fetchUsers = "Select id,name from users where id !=?";

    const [result] = await connection.query(fetchUsers, [loggedInUser.id]);

    res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
