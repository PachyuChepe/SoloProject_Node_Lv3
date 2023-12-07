// service/product.service.js
const ProductRepository = require("../repository/product.repository.js");
const ApiError = require("../middleware/apiError.middleware.js");

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  createProduct = async (userId, productData) => {
    return await this.productRepository.createProduct({
      ...productData,
      userId,
    });
  };

  getAllProducts = async (sort) => {
    return await this.productRepository.findAllProducts(sort);
  };

  getProductById = async (id) => {
    const product = await this.productRepository.findProductById(id);
    if (!product) {
      throw ApiError.NotFound("상품이 존재하지 않습니다.");
    }
    return product;
  };

  updateProduct = async (productId, userId, updateData) => {
    const updatedProduct = await this.productRepository.updateProduct(productId, userId, updateData);
    if (updatedProduct.count === 0) {
      throw ApiError.NotFound("수정할 상품이 존재하지 않습니다.");
    }
    return updatedProduct;
  };

  deleteProduct = async (productId, userId) => {
    const deletedProduct = await this.productRepository.deleteProduct(productId, userId);
    if (deletedProduct.count === 0) {
      throw ApiError.NotFound("삭제할 상품이 존재하지 않습니다.");
    }
    return deletedProduct;
  };
}

module.exports = ProductService;

// const ProductRepository = require("../repository/product.repository");

// class ProductService {
//   constructor() {
//     this.productRepository = new ProductRepository();
//   }

//   createProduct = async (userId, productData) => {
//     return await this.productRepository.createProduct({
//       ...productData,
//       userId,
//     });
//   };

//   getAllProducts = async (sort) => {
//     return await this.productRepository.findAllProducts(sort);
//   };

//   getProductById = async (id) => {
//     return await this.productRepository.findProductById(id);
//   };

//   updateProduct = async (productId, userId, updateData) => {
//     return await this.productRepository.updateProduct(productId, userId, updateData);
//   };

//   deleteProduct = async (productId, userId) => {
//     return await this.productRepository.deleteProduct(productId, userId);
//   };
// }

// module.exports = ProductService;
