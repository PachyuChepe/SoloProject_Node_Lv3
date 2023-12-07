const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkDatabaseConnection() {
  try {
    // 데이터베이스 연결 확인
    await prisma.$queryRaw`SELECT 1`;

    // User 테이블 확인
    const userTable = await prisma.$queryRaw`SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'User'`;
    console.log("유저 뭐나옴", userTable[0].count);
    if (Number(userTable[0].count) === 0) {
      throw new Error("User 테이블이 존재하지 않습니다.");
    }

    // Product 테이블 확인
    const productTable =
      await prisma.$queryRaw`SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product'`;
    console.log("아이템 뭐나옴", productTable[0].count);
    if (Number(productTable[0].count) === 0) {
      throw new Error("Product 테이블이 존재하지 않습니다.");
    }

    console.log("Prisma 데이터베이스 및 테이블 연결 성공");
  } catch (error) {
    // console.error("Prisma 데이터베이스 연결 및 테이블 확인 에러:", error);
    throw error;
  }
}

module.exports = { checkDatabaseConnection };
