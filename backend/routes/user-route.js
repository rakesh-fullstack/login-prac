const router = require("express").Router();

const {
  login,
  register,
  getUserDetails,
  forgotPassword,
  resetPassword,
  sendEmailVerificationOTP,
  verifyEmail,
  sendMobileVerificationOTP,
  verifyMobile,
} = require("../controllers/user-controller");
const { authenticate } = require("../middlewares/auth-middleware");

router.post("/register", register);
router.get("/login", login);
router.get("/getUserDetails", authenticate, getUserDetails);
router.get("/forgotPassword", forgotPassword);
router.get("/resetPassword", resetPassword);
router.get("/sendEmailVerificationOTP", sendEmailVerificationOTP);
router.get("/verifyEmail", verifyEmail);
router.get("/sendMobileVerificationOTP", sendMobileVerificationOTP);
router.get("/verifyMobile", verifyMobile);

module.exports = router;
