const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const https = require("https");
const fs = require("fs");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");

// 환경 설정 및 데이터베이스 설정
const env = require("./config/env.config.js");
const dbConfig = require("./config/db.config.js");
const conn = dbConfig.init();
dbConfig.connect(conn);

// 익스프레스 앱 생성 및 설정
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["https://localhost:8080", "http://localhost:8080"],
    credentials: true,
  })
);

// 라우터 설정
const userRouter = require("./routes/user.router.js");
const itemRouter = require("./routes/products.router.js");
app.use("/", [userRouter, itemRouter]);

// Swagger API 문서 설정
const apiSpec = YAML.load("swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiSpec));

// 기본 경로 설정
app.get("/", (req, res) => {
  res.send("안녕하세요 세계!");
});

// 서버 생성 및 실행
let server;
if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
  const privateKey = fs.readFileSync(__dirname + "/key.pem", "utf8");
  const certificate = fs.readFileSync(__dirname + "/cert.pem", "utf8");
  const credentials = { key: privateKey, cert: certificate };
  server = https.createServer(credentials, app);
  server.listen(env.SERVER_PORT, () => console.log(`HTTPS server is running on port ${env.SERVER_PORT}`));
} else {
  server = app.listen(env.SERVER_PORT, () => console.log(`HTTP server is running on port ${env.SERVER_PORT}`));
}

module.exports = server;
