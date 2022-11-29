const router = require("express").Router();

const {
  login,
  register,
  getUserDetails,
  forgotPassword,
  resetPassword,
} = require("../controller/user");

router.post("/register", register);
router.get("/login", login);
router.get("/getUserDetails", getUserDetails);
router.get("/forgotPassword", forgotPassword);
router.get("/resetPassword", resetPassword);

module.exports = router;
