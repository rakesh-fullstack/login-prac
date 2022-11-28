const { DataTypes } = require("sequelize");
const sequelize = require("./../db");

const bcrypt = require("bcrypt");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
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
        this.setDataValue(bcrypt.hash(data.password));
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

(async () => {
  await sequelize.sync({ force: true });
})();

User.sync({ force: true })
  .then((data) => {
    console.log("User table succesfully created");
  })
  .catch((error) => {
    console.log("Error syncing the User model");
  });

module.exports = {
  User,
};
