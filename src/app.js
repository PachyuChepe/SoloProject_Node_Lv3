// app.js

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const https = require("https");
const fs = require("fs");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const morganConfig = require("./config/morgan.config.js");

// 환경 설정 및 데이터베이스 설정
const env = require("./config/env.config.js");
const { checkDatabaseConnection } = require("./config/db.config.js");

// 익스프레스 앱 생성 및 설정
const app = express();
app.use(express.json());
app.use(cookieParser());
morganConfig(app);

// CORS 설정
app.use(
  cors({
    origin: [`https://localhost:${env.SERVER_PORT}`, "https://www.vitahub.xyz"],
    credentials: true,
  }),
);

// 라우터 설정
const userRouter = require("./routes/user.router.js");
const itemRouter = require("./routes/products.router.js");
const errorHandler = require("./middleware/errorHandler.middleware.js");
app.use("/api", [userRouter, itemRouter]);
app.use(errorHandler);

// Swagger API 문서화 설정
const apiSpec = YAML.load("api-docs/swagger.yaml");
apiSpec.servers = apiSpec.servers.map((server) => {
  if (server.url.includes("localhost")) {
    return {
      ...server,
      url: `https://localhost:${env.SERVER_PORT}`,
    };
  }
  return server;
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiSpec));

// 기본 경로 설정
app.get("/", (req, res) => {
  res.send("안녕하세요 세계!");
});

// 데이터베이스 연결 확인 및 HTTPS/HTTP 서버 시작
checkDatabaseConnection()
  .then(() => {
    let server;
    // HTTPS 서버 설정 및 시작 (키 파일이 존재하는 경우)
    if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
      const privateKey = fs.readFileSync(__dirname + "/../key.pem", "utf8");
      const certificate = fs.readFileSync(__dirname + "/../cert.pem", "utf8");
      const credentials = { key: privateKey, cert: certificate };
      server = https.createServer(credentials, app);
      server.listen(env.SERVER_PORT, () => {
        console.log(`HTTPS server is running on port ${env.SERVER_PORT}`);
      });
    }
    // HTTP 서버 설정 및 시작 (그렇지 않은 경우)
    else {
      server = app.listen(env.SERVER_PORT, () => {
        console.log(`HTTP server is running on port ${env.SERVER_PORT}`);
      });
    }
  })
  .catch((error) => {
    console.error("서버 시작 실패", error);
    process.exit(1);
  });
