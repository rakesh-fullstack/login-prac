require("dotenv").config();

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
  }
);

try {
  sequelize.authenticate();
  console.log("file: index.js ~ Succesfully connected to SQL");
} catch (err) {
  console.log("file: index.js ~ line 21 ~ Error while connecting to sql", err);
}

module.exports = sequelize;
