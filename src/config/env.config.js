// config/env.config.js

require("dotenv").config();

module.exports = {
  SERVER_PORT: process.env.SERVER_PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  CT_MYSQL_HOST: process.env.CT_MYSQL_HOST,
  CT_MYSQL_PORT: process.env.CT_MYSQL_PORT,
  CT_MYSQL_USERNAME: process.env.CT_MYSQL_USERNAME,
  CT_MYSQL_PASSWORD: process.env.CT_MYSQL_PASSWORD,
  CT_MYSQL_DATABASE_NAME: process.env.CT_MYSQL_DATABASE_NAME,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
};
