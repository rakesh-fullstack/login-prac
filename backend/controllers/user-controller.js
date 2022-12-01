const { User } = require("../models/user.js");
const { Otp } = require("../models/otp.js");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const {
  sendMail,
  getEmailVerificationEmailTemplate,
  getPasswordResetTemplate,
} = require("../utils/mail");
const jwt = require("jsonwebtoken");
const { generateOTP, createRandomBytes } = require("../utils/helper");
const { sendMessage } = require("../utils/message");
const {
  PHONE_VERIFICATION_MESSAGE,
  EMAIL_VERFICATION_SUBJECT,
  FORGOT_PASSWORD_EMAIL_SUBJECT,
} = require("../constants/message-constants.js");
const { ResetToken } = require("../models/resetToken.js");
const errorStatus = require("../constants/response-status.js");
const {
  EMAIL_EXISTS_ERROR_MESSAGE,
  INVALID_INPUT_ERROR_MESSAGE,
  WRONG_PASSWORD_ERROR_MESSAGE,
  WRONG_OTP_ERROR_MESSAGE,
  CORRECT_OTP_MESSAGE,
  EMAIL_NOT_FOUND_ERROR_MESSAGE,
  OTP_SENT_MESSAGE,
  OTP_NOT_GENERATED,
} = require("../constants/error-constants.js");
const responseStatus = require("../constants/response-status.js");

const register = async (req, res) => {
  try {
    data = req.body;

    const user = await User.findOne({
      attributes: ["email", "password"],
      where: {
        email: data.email,
      },
      raw: true,
    });

    if (user) {
      return sendError(res, 403, EMAIL_EXISTS_ERROR_MESSAGE);
    }

    // Validate data

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
      status: responseStatus.SUCCESS,
    });
  } catch (err) {
    console.log("Register ~ Error", err);
    return sendError(res, 500, err.toString());
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (_.isEmpty(email) || _.isEmpty(password)) {
    return sendError(res, 400, INVALID_INPUT_ERROR_MESSAGE);
  }

  const user = await User.findOne({
    attributes: ["email", "password"],
    where: {
      email: email,
    },
    raw: true,
  });

  if (_.isEmpty(user)) {
    return sendError(res, 401, EMAIL_NOT_FOUND_ERROR_MESSAGE);
  }

  bcrypt.compare(password, user.password, (err, data) => {
    if (err) {
      console.log(err);
    }

    if (data) {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

      return res.status(200).json({
        status: responseStatus.SUCCESS,
        accessToken: accessToken,
      });
    } else {
      return sendError(res, 401, WRONG_PASSWORD_ERROR_MESSAGE);
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
      status: responseStatus.SUCCESS,
    });
  } catch (err) {
    console.log("getUserDetails ~ Error", err);
    return sendError(res, 500, err.toString());
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 401, INVALID_INPUT_ERROR_MESSAGE);
    }

    const user = await User.findOne({
      attributes: ["email", "id"],
      where: {
        email: email,
      },
      raw: true,
    });

    if (!user) {
      return sendError(res, 403, EMAIL_NOT_FOUND_ERROR_MESSAGE);
    }

    console.log(user);
    const dbtoken = await ResetToken.findOne({ where: { owner: user.id } });

    if (dbtoken) {
      return sendError(
        res,
        403,
        "You can request for new token after expiry of existing token or 1 hour later"
      );
    }

    const randomToken = await createRandomBytes();
    const resetToken = ResetToken.build({ owner: user.id, token: randomToken });
    await resetToken.save();

    await sendMail({
      to: user.email,
      subject: FORGOT_PASSWORD_EMAIL_SUBJECT,
      html: getPasswordResetTemplate(
        `http://localhost:3000/reset-password?token=${randomToken}&id=${user.id}`
      ),
    });

    res.status(200).json({
      status: responseStatus.SUCCESS,
      message: "Password reset link sent to your email!",
    });
  } catch (err) {
    console.log(" forgot password ~ Error", err);
    return sendError(res, 500, err.toString());
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
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 400, INVALID_INPUT_ERROR_MESSAGE);
    }

    const otp = generateOTP();

    await Otp.create({
      otp: otp,
      type: "email",
      email: email,
    });

    await sendMail({
      to: email,
      subject: EMAIL_VERFICATION_SUBJECT,
      otp: otp,
      html: getEmailVerificationEmailTemplate(otp),
    });

    return res.status(200).json({
      status: responseStatus.SUCCESS,
      message: OTP_SENT_MESSAGE,
    });
  } catch (err) {
    return sendError(res, 403, err.toString());
  }
};

const verifyEmail = async (req, res) => {
  const { email, userOtp } = req.body;

  if (!email || !userOtp) {
    return sendError(res, 400, INVALID_INPUT_ERROR_MESSAGE);
  }

  const otp = await Otp.findOne({
    where: { email: email },
    order: [["createdAt", "DESC"]],
    raw: true,
  });

  if (!otp) {
    return sendError(res, 403, OTP_NOT_GENERATED);
  }
  const sentOtp = otp.otp;

  if (sentOtp != userOtp) {
    return sendError(res, 403, WRONG_OTP_ERROR_MESSAGE);
  }

  return res.status(200).json({
    status: responseStatus.SUCCESS,
    message: CORRECT_OTP_MESSAGE,
  });
};

const sendMobileVerificationOTP = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return sendError(res, 400, INVALID_INPUT_ERROR_MESSAGE);
    }
    const otp = generateOTP();

    await Otp.create({
      otp: otp,
      type: "mobile",
      mobile: mobile,
    });

    await sendMessage({
      message: PHONE_VERIFICATION_MESSAGE(otp),
      contactNumber: mobile,
    });

    res.status(200).json({
      status: responseStatus.SUCCESS,
      message: OTP_SENT_MESSAGE,
    });
  } catch (err) {
    return sendError(res, 500, err.toString());
  }
};

const verifyMobile = async (req, res) => {
  const { mobile, userOtp } = req.body;

  if (!mobile || !userOtp) {
    return sendError(res, 400, INVALID_INPUT_ERROR_MESSAGE);
  }

  const otp = await Otp.findOne({
    where: { mobile: mobile },
    order: [["createdAt", "DESC"]],
    raw: true,
  });

  if (!otp) {
    return sendError(res, 403, OTP_NOT_GENERATED);
  }

  const sentOtp = otp.otp;

  if (sentOtp != userOtp) {
    return sendError(res, 403, WRONG_OTP_ERROR_MESSAGE);
  }

  return res.status(200).json({
    status: responseStatus.SUCCESS,
    message: CORRECT_OTP_MESSAGE,
  });
};

const sendError = (res, status, message) => {
  return res.status(status).send({
    status: errorStatus.ERROR,
    message: message,
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
