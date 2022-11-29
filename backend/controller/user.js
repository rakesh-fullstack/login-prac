const { User } = require("./../models/user.js");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    data = req.body;
    const newUser = User.build({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      userName: data.userName,
    });

    console.log("file: user.js ~ line 15 ~ register ~ newUser", newUser);
    await newUser.save();

    res.status(200).json({
      data: newUser,
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

  console.log(user);

  bcrypt.compare(password, user.password, (err, data) => {
    if (err) {
      console.log(err);
    }

    if (data) {
      return res.status(200).json({
        status: "success",
        data: user,
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
    const { email } = req.query;
    const user = await User.findOne({
      where: {
        email: email,
      },
      exclude: ["password"],
      raw: true,
    });

    res.status(200).json({
      data: user,
      status: "success",
    });
  } catch (err) {
    console.log("file: user.js ~ line 78 ~ register ~ Error", err);
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
};

const forgotPassword = async (req, res) => {};

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

module.exports = { register, login, getUserDetails, forgotPassword, resetPassword };
