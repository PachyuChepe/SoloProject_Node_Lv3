// config/winston.config.js

const winston = require("winston");
const { format } = require("logform");

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.printf((info) => {
    return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}\nRequest Info: ${JSON.stringify(
      {
        method: info.method,
        path: info.path,
        body: info.body,
        query: info.query,
        params: info.params,
      },
      null,
      2,
    )}\nStack Trace: ${info.stack}`;
  }),
);

const logger = winston.createLogger({
  level: "error",
  format: logFormat,
  transports: [new winston.transports.File({ filename: "logs/error.log", level: "error" })],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  );
}

module.exports = logger;
