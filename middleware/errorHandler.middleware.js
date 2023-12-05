const ApiError = require("../error/api.error.js");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({ success: false, message: err.message });
    return;
  }

  console.error(err); // 콘솔 로그가 아닌 에러 로깅 시스템 사용 필요
  res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
};

module.exports = errorHandler;
