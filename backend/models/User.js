const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("postgresql");

const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
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
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "users",
  }
);

(async () => {
  await sequelize.sync({ force: true });
  // Code here
})();

module.exports = {
  User,
};
