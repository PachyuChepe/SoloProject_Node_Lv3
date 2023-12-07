// middleware/errorHandler.middleware.js

const ApiError = require("./apiError.middleware.js");
const winston = require("winston");
const { format } = require("logform");

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.printf((info) => {
    // 보다 읽기 쉬운 형식으로 로그 메시지 구성
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
  transports: [new winston.transports.File({ filename: "error.log", level: "error" })],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  );
}

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({ success: false, message: err.message });
    return;
  }

  // 필터링된 요청 데이터 생성
  const filteredRequestBody = req.body.password ? { ...req.body, password: "HIDDEN" } : req.body;

  const logMessage = `
    [Error]: ${err.message}
    [Timestamp]: ${new Date().toISOString()}
    [Method]: ${req.method}
    [Path]: ${req.path}
    [Body]: ${JSON.stringify(filteredRequestBody, null, 2)}
    [Query]: ${JSON.stringify(req.query, null, 2)}
    [Params]: ${JSON.stringify(req.params, null, 2)}
    [Stack]: ${err.stack}
  `;

  logger.error(logMessage);
  res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
};

module.exports = errorHandler;

// const ApiError = require("./apiError.middleware.js");
// const winston = require("winston");
// const { format } = require("logform");

// const logFormat = format.combine(
//   format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//   format.errors({ stack: true }), // 스택 트레이스 포함
//   format.json(),
// );

// const logger = winston.createLogger({
//   level: "error",
//   format: logFormat,
//   transports: [new winston.transports.File({ filename: "error.log", level: "error" })],
// });

// if (process.env.NODE_ENV !== "production") {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
//     }),
//   );
// }

// const errorHandler = (err, req, res, next) => {
//   if (err instanceof ApiError) {
//     res.status(err.status).json({ success: false, message: err.message });
//     return;
//   }

//   const errorInfo = {
//     message: err.message,
//     stack: err.stack,
//     path: req.path,
//     method: req.method,
//     body: req.body,
//     query: req.query,
//     params: req.params,
//   };

//   logger.error(errorInfo);
//   // console.error(err);
//   // 콘솔 로그가 아닌 에러 로깅 시스템 사용 필요
//   res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
// };

// module.exports = errorHandler;
