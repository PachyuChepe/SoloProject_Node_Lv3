const { spawn } = require("child_process");
const mysql = require("mysql2/promise");
const env = require("./env.config.js");

// 기존 MySQL 데이터베이스를 삭제하는 함수
async function dropDatabase() {
  // MySQL 데이터베이스 연결 설정
  const connection = await mysql.createConnection({
    host: env.CT_MYSQL_HOST,
    port: env.CT_MYSQL_PORT,
    user: env.CT_MYSQL_USERNAME,
    password: env.CT_MYSQL_PASSWORD,
  });

  // 삭제할 데이터베이스 이름
  const dbName = env.CT_MYSQL_DATABASE_NAME;
  const query = `DROP DATABASE IF EXISTS ${dbName}`;

  // 데이터베이스 삭제 실행 및 결과 로깅
  try {
    await connection.query(query);
    console.log(`DataBase ${dbName} 삭제 완료`);
  } catch (error) {
    console.error(`DataBase 삭제 오류: ${error.message}`);
  } finally {
    await connection.end();
  }
}

// Prisma를 사용하여 새 데이터베이스를 생성하는 함수
async function setPrismaDB() {
  await dropDatabase();

  // Prisma 명령어를 통한 데이터베이스 생성
  const prismaProcess = spawn("npx", ["prisma", "db", "push"], {
    shell: true,
    stdio: "inherit",
  });

  // Prisma 프로세스 종료 시 로깅
  prismaProcess.on("close", (code) => {
    if (code === 0) {
      console.log("PrismaDB 생성 완료");
    } else {
      console.error(`PrismaDB 생성 실패: ${code}`);
    }
  });
}

setPrismaDB();
