const morgan = require("morgan");
const logger = require("./winston.config");

const morganConfig = (app) => {
  // 모든 HTTP 요청에 대해 로그하지만, 4xx와 5xx 응답은 제외
  app.use(
    morgan((tokens, req, res) => {
      const status = tokens.status(req, res);
      if (status < 400 || status >= 600) {
        return [tokens.method(req, res), tokens.url(req, res), status, tokens["response-time"](req, res), "ms"].join(" ");
      }
    }),
  );

  // HTTP 상태 코드가 4xx와 5xx인 경우만 winston에 로그
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
