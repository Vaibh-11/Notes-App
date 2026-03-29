const express = require("express");
const {
  userSignUp,
  userLogin,
  getLogInUser,
  userLogout,
  getAllUsers,
} = require("../controllers/auth");
const { userAuth } = require("../middleware/authentication");
const router = express.Router();

router.route("/signup").post(userSignUp);
router.route("/login").post(userLogin);
router.route("/logout").post(userLogout);
router.route("/getAllUsers").get(userAuth, getAllUsers);
router.route("/getLogInUser").get(userAuth, getLogInUser);

module.exports = router;
