const defaultLength = 6;
const crypto = require("crypto");

const generateOTP = () => {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < defaultLength; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

const createRandomBytes = () => {
  var token = crypto.randomBytes(30).toString("hex");
  return token;
};

module.exports = { generateOTP, createRandomBytes };
