const { pg } = require("pg");
require("dotenv").config();
const { Sequelize } = require("sequelize");

const HOST = process.env.PGHOST;
const DB = process.env.PGDATABASE;
const USER = process.env.PGUSER;
const PWD = process.env.PGPASSWORD;

const sequelize = new Sequelize(`postgres://${USER}:${PWD}@${HOST}:5432/${DB}`, {
  dialectModule: pg,
});

// const sequelize = new Sequelize(
//   process.env.PGDATABASE,
//   process.env.PGUSER,
//   process.env.PGPASSWORD,
//   {
//     host: process.env.PGHOST,
//     dialect: "postgres",
//   }
// );

try {
  sequelize.authenticate();
  console.log("file: index.js ~ Succesfully connected to SQL");
} catch (err) {
  console.log("file: index.js ~ line 28 ~ Error while connecting to sql", err);
}

module.exports = sequelize;
