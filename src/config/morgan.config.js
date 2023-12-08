const morgan = require("morgan");
const logger = require("./winston.config");

/**
 * Express 앱에 대한 HTTP 로깅 설정
 * @param {object} app - Express 애플리케이션 인스턴스
 */

const morganConfig = (app) => {
  // 4xx 및 5xx 상태 코드를 제외한 모든 HTTP 요청을 콘솔에 로깅
  app.use(
    morgan((tokens, req, res) => {
      const status = tokens.status(req, res);
      if (status < 400 || status >= 600) {
        return [tokens.method(req, res), tokens.url(req, res), status, tokens["response-time"](req, res), "ms"].join(" ");
      }
    }),
  );

  // HTTP 상태 코드가 4xx 또는 5xx인 경우 winston을 사용하여 오류 로깅
  app.use(
    morgan((tokens, req, res) => {
      const status = tokens.status(req, res);
      if (status >= 400 && status < 600) {
        logger.error(`${tokens.method(req, res)} ${tokens.url(req, res)} ${status} ${tokens["response-time"](req, res)}ms`);
      }
    }),
  );
};

module.exports = morganConfig;
