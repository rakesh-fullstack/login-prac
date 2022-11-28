const db = require("./../db");
const User = require("./../models/User.js");

const register = async (req, res) => {
  data = req.body;
  const newUser = User.build({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.lastName,
    password: password,
  });

  console.log("file: user.js ~ line 20 ~ register ~ newUser", newUser);
  await newUser.save();
};

const login = async (req, res) => {};

const getUserDetails = async (req, res) => {
  const { email } = req.query;
  const user = User.findAll({
    where: {
      email: email,
    },
  });

  console.log(user);
};

const forgotPassword = async (req, res) => {};

const resetPassword = async (req, res) => {};

module.exports = { register, login, getUserDetails, forgotPassword, resetPassword };
