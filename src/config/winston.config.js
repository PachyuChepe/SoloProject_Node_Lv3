// config/winston.config.js

const winston = require("winston");
const { format } = require("logform");

// 로그 메시지의 포맷을 정의
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // 타임스탬프 포맷 설정
  format.errors({ stack: true }), // 에러 스택 추적 활성화
  format.printf((info) => {
    // 로그 메시지 포맷 정의
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

// winston 로거 생성 및 설정
const logger = winston.createLogger({
  level: "error", // 로그 레벨 설정
  format: logFormat, // 정의된 로그 포맷 사용
  transports: [new winston.transports.File({ filename: "logs/error.log", level: "error" })],
});

// 개발 환경에서는 콘솔로도 로그 출력
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  );
}

module.exports = logger;
