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
router.post("/login", login);
router.get("/getUserDetails", authenticate, getUserDetails);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/sendEmailVerificationOTP", sendEmailVerificationOTP);
router.post("/verifyEmail", verifyEmail);
router.post("/sendMobileVerificationOTP", sendMobileVerificationOTP);
router.post("/verifyMobile", verifyMobile);

module.exports = router;
