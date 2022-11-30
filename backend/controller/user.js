const { User } = require("./../models/user.js");
const { Otp } = require("./../models/otp.js");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { sendMail } = require("./../utils/sendEmail");
const jwt = require("jsonwebtoken");
const { generateOTP } = require("./../utils/otpHelper");
const { sendMessage } = require("./../utils/sendMessage");

const register = async (req, res) => {
  try {
    data = req.body;
    const newUser = User.build({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      userName: data.userName,
      mobile: data.mobile,
    });

    console.log("file: user.js ~ line 15 ~ register ~ newUser", newUser);
    await newUser.save();

    res.status(200).json({
      data: { user: newUser },
      status: "success",
    });
  } catch (err) {
    console.log("file: user.js ~ line 23 ~ register ~ Error", err);
    res.status(500).json({
      status: "error",
      message: err.toString(),
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (_.isEmpty(email) || _.isEmpty(password)) {
    return res.status(400).send({
      status: "error",
      message: "Please check the input",
    });
  }

  const user = await User.findOne({
    attributes: ["email", "password"],
    where: {
      email: email,
    },
    raw: true,
  });

  if (_.isEmpty(user)) {
    return res.status(401).send({
      status: "error",
      message: "No such user exists, please check mail",
    });
  }

  bcrypt.compare(password, user.password, (err, data) => {
    if (err) {
      console.log(err);
    }

    if (data) {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

      return res.status(200).json({
        status: "success",
        accessToken: accessToken,
      });
    } else {
      return res.status(401).json({
        status: "error",
        message: "Wrong password, please try again",
      });
    }
  });
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.user.email,
      },
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      raw: true,
    });

    res.status(200).json({
      data: {
        user,
      },
      status: "success",
    });
  } catch (err) {
    console.log("getUserDetails ~ Error", err);
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const message = `<h1> User reset password template, Click on the link to reset password </h1>`;
    const t = await sendMail({
      to: email,
      subject: "Password reset request",
      text: message,
    });

    console.log(t);

    res.status(200).json({
      status: "success",
      message: "Email Sent Succesfully",
    });
  } catch (err) {
    console.log("file: user.js ~ line 105 ~ forgot password ~ Error", err);
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id, password } = req.body;
    const user = User.findOne({ id: id });

    const result = await user.update({ password: password }, { where: { id: id } });
    console.log(result);
  } catch (err) {
    console.log("file: user.js ~ line 96 ~ reset Password ~ Error", err);
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
};

const sendEmailVerificationOTP = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  await Otp.create({
    otp: otp,
    type: "email",
    email: email,
  });

  const message = `Use this OTP ${otp} to verify email </h1>`;
  await sendMail({
    to: email,
    subject: "Verify email otp",
    text: message,
  });

  res.status(200).json({
    status: "success",
    message: "Email Otp sent",
  });
};

const verifyEmail = async (req, res) => {
  const { email, userOtp } = req.body;

  const otp = await Otp.findOne({
    where: { email: email },
    order: [["createdAt", "DESC"]],
    raw: true,
  });
  const sentOtp = otp.otp;

  if (sentOtp != userOtp) {
    return res.status(200).json({
      status: "error",
      message: "Wrong Otp, please try again",
    });
  }

  // update isEmailVerified in user table
  return res.status(200).json({
    status: "success",
    message: "Correct OTP, mobile verified",
  });
};

const sendMobileVerificationOTP = async (req, res) => {
  const { mobile } = req.body;
  const otp = generateOTP();

  await Otp.create({
    otp: otp,
    type: "mobile",
    mobile: mobile,
  });

  sendMessage({
    message: `Your OTP is ${otp}`,
    contactNumber: mobile,
  });

  res.status(200).json({
    status: "success",
    message: "Mobile Otp sent",
  });
};

const verifyMobile = async (req, res) => {
  const { mobile, userOtp } = req.body;

  const otp = await Otp.findOne({
    where: { mobile: mobile },
    order: [["createdAt", "DESC"]],
    raw: true,
  });
  console.log(otp);
  const sentOtp = otp.otp;

  if (sentOtp != userOtp) {
    return res.status(200).json({
      status: "error",
      message: "Wrong Otp, please try again",
    });
  }
  // update isMobileVeried in user table

  return res.status(200).json({
    status: "success",
    message: "Correct OTP, mobile verified",
  });
};

module.exports = {
  register,
  login,
  getUserDetails,
  forgotPassword,
  resetPassword,
  sendEmailVerificationOTP,
  verifyEmail,
  sendMobileVerificationOTP,
  verifyMobile,
};
