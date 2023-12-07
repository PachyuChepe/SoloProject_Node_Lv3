// middleware/errorHandler.middleware.js

const ApiError = require("./apiError.middleware.js");
const logger = require("../config/winston.config.js");

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
