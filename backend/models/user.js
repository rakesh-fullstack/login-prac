const { DataTypes, Model, fn } = require("sequelize");
const sequelize = require("./../db");

const bcrypt = require("bcrypt");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(value, salt);
        this.setDataValue("password", hash);
        console.log(value, hash);
      },
      get() {
        return null;
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
  }
);

User.sync({ alter: true })
  .then((data) => {
    console.log("User table succesfully created");
  })
  .catch((error) => {
    console.log("Error syncing the User model");
  });

module.exports = {
  User,
};
