const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Prisma 데이터베이스 연결 성공");
  } catch (error) {
    console.error("Prisma 데이터베이스 연결 에러:", error);
  }
}

module.exports = { checkDatabaseConnection };
