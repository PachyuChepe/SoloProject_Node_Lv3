const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConfig = require("./config/db.config.js");
const conn = dbConfig.init();
dbConfig.connect(conn);
const https = require("https");
const fs = require("fs");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");

// 환경 설정 및 데이터베이스 연결
const env = require("./config/env.config.js");
// const connect = require("./schemas");
// connect();

// Swagger API 문서 로드
const apiSpec = YAML.load("swaggerUser.yaml");

// 미들웨어 설정
app.use(express.json());
app.use(cookieParser());
// API 문서 노출
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiSpec));

// 루트 경로
app.get("/", (req, res) => {
  res.send("안녕하세요 세계!");
});

app.use(
  cors({
    origin: ["https://localhost:8080", "http://localhost:8080"],
    credentials: true,
  })
);

// 제품 관련 라우터 설정
// const productsSchema = require("./routes/productsRouter");
// app.use("/api", [productsSchema]);

const userRouter = require("./routes/user.router.js");
app.use("/", [userRouter]);

// 서버 설정
let server;
if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
  // HTTPS 서버 설정
  const privateKey = fs.readFileSync(__dirname + "/key.pem", "utf8");
  const certificate = fs.readFileSync(__dirname + "/cert.pem", "utf8");
  const credentials = { key: privateKey, cert: certificate };
  server = https.createServer(credentials, app);
  server.listen(env.SERVER_PORT, () => console.log(`HTTPS server is running on port ${env.SERVER_PORT} `));
} else {
  // HTTP 서버 설정
  server = app.listen(env.SERVER_PORT, () => console.log(`HTTP server is running on port ${env.SERVER_PORT}`));
}

module.exports = server;
