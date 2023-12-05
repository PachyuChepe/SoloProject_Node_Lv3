const { spawn } = require("child_process");
const mysql = require("mysql2/promise");
const env = require("../config/env.config.js");

// 데이터베이스 삭제 함수
async function dropDatabase() {
  // MySQL 연결 정보 설정
  const connection = await mysql.createConnection({
    host: env.CT_MYSQL_HOST,
    port: env.CT_MYSQL_PORT,
    user: env.CT_MYSQL_USERNAME,
    password: env.CT_MYSQL_PASSWORD,
  });

  const dbName = env.CT_MYSQL_DATABASE_NAME;
  const query = `DROP DATABASE IF EXISTS ${dbName}`;

  try {
    await connection.query(query);
    console.log(`DataBase ${dbName} 삭제 완료`);
  } catch (error) {
    console.error(`DataBase 삭제 오류: ${error.message}`);
  } finally {
    await connection.end();
  }
}

// 데이터베이스 생성 함수
async function setPrismaDB() {
  await dropDatabase();

  // Prisma 명령 실행
  const prismaProcess = spawn("npx", ["prisma", "db", "push"], {
    shell: true,
    stdio: "inherit",
  });

  prismaProcess.on("close", (code) => {
    if (code === 0) {
      console.log("PrismaDB 생성 완료");
    } else {
      console.error(`PrismaDB 생성 실패: ${code}`);
    }
  });
}

setPrismaDB();
