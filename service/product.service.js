// service/product.service.js

const ProductRepository = require("../repository/product.repository");

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
    return await this.productRepository.findProductById(id);
  };

  updateProduct = async (productId, userId, updateData) => {
    return await this.productRepository.updateProduct(productId, userId, updateData);
  };

  deleteProduct = async (productId, userId) => {
    return await this.productRepository.deleteProduct(productId, userId);
  };
}

module.exports = ProductService;
