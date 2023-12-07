// middleware/errorHandler.middleware.js

const ApiError = require("./apiError.middleware.js");
const winston = require("winston");
const { format } = require("logform");

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }), // 스택 트레이스 포함
  format.json(),
);

const logger = winston.createLogger({
  level: "error",
  format: logFormat,
  transports: [new winston.transports.File({ filename: "error.log", level: "error" })],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: format.simple(),
    }),
  );
}

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({ success: false, message: err.message });
    return;
  }

  const errorInfo = {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
  };

  logger.error(errorInfo);
  // console.error(err);
  // 콘솔 로그가 아닌 에러 로깅 시스템 사용 필요
  res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
};

module.exports = errorHandler;
