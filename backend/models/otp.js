const { DataTypes } = require("sequelize");
const sequelize = require("./../db");

const Otp = sequelize.define(
  "otp",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      enum: ["email", "mobile"],
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "otp",
  }
);

Otp.sync({ alter: true })
  .then((data) => {
    console.log("OTP table succesfully created");
  })
  .catch((error) => {
    console.log("Error syncing the OTP model");
  });

module.exports = {
  Otp,
};
