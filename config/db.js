const mysql = require("mysql");

const { DB_USERNAME,DB_NAME, DB_PASS, DB_SERVER } = process.env;

const pool = mysql.createPool({
  connectionLimit : 5,
  host: DB_SERVER,
  database: DB_NAME,
  user: DB_USERNAME,
  password: DB_PASS,
  port: 52084
});

module.exports = pool