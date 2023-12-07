// middleware/errorHandler.middleware.js

const ApiError = require("./apiError.middleware.js");
const logger = require("../config/winston.config.js");

/**
 * Express 앱의 모든 오류를 처리하는 미들웨어
 * @param {object} err - 오류 객체
 * @param {object} req - HTTP 요청 객체
 * @param {object} res - HTTP 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 */

const errorHandler = (err, req, res, next) => {
  // ApiError 인스턴스인 경우 사용자 정의 응답 반환
  if (err instanceof ApiError) {
    res.status(err.status).json({ success: false, message: err.message });
    return;
  }

  // 비밀번호 필드가 있을 경우 숨김 처리
  const filteredRequestBody = req.body.password ? { ...req.body, password: "HIDDEN" } : req.body;

  // 로그 메시지 생성 및 기록
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

  // 서버 오류 응답 반환
  res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
};

module.exports = errorHandler;
