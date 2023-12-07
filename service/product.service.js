// service/product.service.js
const ProductRepository = require("../repository/product.repository.js");
const ApiError = require("../middleware/apiError.middleware.js");

// 상품 관련 비즈니스 로직을 수행하는 서비스 클래스
class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  /**
   * 새 상품을 생성하고 반환
   * @param {number} userId - 사용자 ID
   * @param {object} productData - 상품 데이터
   * @returns {Promise<object>} 생성된 상품 정보
   */
  createProduct = async (userId, productData) => {
    return await this.productRepository.createProduct({
      ...productData,
      userId,
    });
  };

  /**
   * 모든 상품을 조회하고 반환
   * @param {string} sort - 정렬 방식
   * @returns {Promise<Array>} 조회된 상품 목록
   */
  getAllProducts = async (sort) => {
    return await this.productRepository.findAllProducts(sort);
  };

  /**
   * 특정 ID의 상품을 조회하고 반환
   * @param {number} id - 상품 ID
   * @returns {Promise<object>} 조회된 상품 정보
   */
  getProductById = async (id) => {
    const product = await this.productRepository.findProductById(id);
    if (!product) {
      throw ApiError.NotFound("상품이 존재하지 않습니다.");
    }
    return product;
  };

  /**
   * 상품 정보를 업데이트하고 결과를 반환
   * @param {number} productId - 상품 ID
   * @param {number} userId - 사용자 ID
   * @param {object} updateData - 업데이트할 상품 데이터
   * @returns {Promise<object>} 업데이트된 상품 정보
   */
  updateProduct = async (productId, userId, updateData) => {
    const updatedProduct = await this.productRepository.updateProduct(productId, userId, updateData);
    if (updatedProduct.count === 0) {
      throw ApiError.NotFound("수정할 상품이 존재하지 않습니다.");
    }
    return updatedProduct;
  };

  /**
   * 상품을 삭제하고 결과를 반환
   * @param {number} productId - 상품 ID
   * @param {number} userId - 사용자 ID
   * @returns {Promise<object>} 삭제된 상품 정보
   */
  deleteProduct = async (productId, userId) => {
    const deletedProduct = await this.productRepository.deleteProduct(productId, userId);
    if (deletedProduct.count === 0) {
      throw ApiError.NotFound("삭제할 상품이 존재하지 않습니다.");
    }
    return deletedProduct;
  };
}

module.exports = ProductService;
