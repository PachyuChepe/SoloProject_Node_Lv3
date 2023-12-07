// repository/product.repository.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 데이터베이스에서 상품 관련 작업을 수행하는 리포지토리 클래스
class ProductRepository {
  /**
   * 새 상품을 데이터베이스에 추가
   * @param {object} data - 상품 데이터
   * @returns {Promise<object>} 생성된 상품 정보
   */
  createProduct = async (data) => {
    return await prisma.product.create({ data });
  };

  /**
   * 모든 상품을 조회
   * @param {string} sort - 정렬 방식
   * @returns {Promise<Array>} 상품 목록
   */
  findAllProducts = async (sort) => {
    return await prisma.product.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: sort.toLowerCase() },
    });
  };

  /**
   * ID를 기준으로 특정 상품 조회
   * @param {number} id - 상품 ID
   * @returns {Promise<object>} 조회된 상품 정보
   */
  findProductById = async (id) => {
    return await prisma.product.findUnique({
      where: { id },
      include: { user: { select: { name: true } } },
    });
  };

  /**
   * 상품 정보 업데이트
   * @param {number} id - 상품 ID
   * @param {number} userId - 사용자 ID
   * @param {object} data - 업데이트할 상품 데이터
   * @returns {Promise<object>} 업데이트된 상품 정보
   */
  updateProduct = async (id, userId, data) => {
    return await prisma.product.updateMany({
      where: { id, userId },
      data,
    });
  };

  /**
   * 상품 삭제
   * @param {number} id - 상품 ID
   * @param {number} userId - 사용자 ID
   * @returns {Promise<object>} 삭제 결과
   */
  deleteProduct = async (id, userId) => {
    return await prisma.product.deleteMany({
      where: { id, userId },
    });
  };
}

module.exports = ProductRepository;
