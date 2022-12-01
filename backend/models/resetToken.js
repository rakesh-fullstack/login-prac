const { DataTypes } = require("sequelize");
const sequelize = require("./../db");
const bcrypt = require("bcrypt");

const ResetToken = sequelize.define(
  "resetToken",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    owner: {
      type: DataTypes.INTEGER,
      // references: "users",
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        const hash = bcrypt.hashSync(value, 8);
        this.setDataValue("token", hash);
      },
    },
    tokenExpires: {
      type: DataTypes.DATE,
      defaultValue: Date.now() + 3600,
    },
  },
  {
    tableName: "ResetToken",
  }
);

ResetToken.sync({ alter: true })
  .then((data) => {
    console.log("Reset Token table succesfully created");
  })
  .catch((error) => {
    console.log("Error syncing the Reset Token model");
  });

// ResetToken.methods.compareToken = async () => {
//   const result = await bcrypt.compareSync(token, this.token);
//   return result;
// };

module.exports = {
  ResetToken,
};
