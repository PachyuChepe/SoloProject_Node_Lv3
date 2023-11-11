const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
const dbInfo = {
  host: process.env.SERVER_HOST,
  port: process.env.MYSQL_DEFAULT_PORT,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.DATABASE_NAME,
};

module.exports = {
  development: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.SERVER_HOST,
    port: process.env.MYSQL_DEFAULT_PORT,
    dialect: "mysql",
    logging: false, //콘솔창 쿼리 로그 off
  },

  test: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.SERVER_HOST,
    port: process.env.MYSQL_DEFAULT_PORT,
    dialect: "mysql",
    logging: false,
  },

  production: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.SERVER_HOST,
    port: process.env.MYSQL_DEFAULT_PORT,
    dialect: "mysql",
    logging: false,
  },

  init: function () {
    return mysql.createConnection(dbInfo);
  },

  connect: function (conn) {
    conn.connect(function (err) {
      if (err) console.error("데이터베이스 연결 에러 : " + err);
      else console.log("데이터베이스 연결 성공");
    });
  },
};
