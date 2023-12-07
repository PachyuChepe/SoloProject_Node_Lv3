// controller/product.controller.js

const ProductService = require("../service/product.service.js");

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (req, res, next) => {
    try {
      const { id: userId } = res.locals.user;
      const newItem = await this.productService.createProduct(userId, req.body);
      res.status(201).json({ success: true, message: "판매 상품을 등록하였습니다.", data: newItem });
    } catch (err) {
      next(err);
    }
  };

  getAllProducts = async (req, res, next) => {
    try {
      const sort = req.query.sort ? req.query.sort.toUpperCase() : "DESC";
      const products = await this.productService.getAllProducts(sort);
      res.status(200).json({ success: true, data: products });
    } catch (err) {
      next(err);
    }
  };

  getProductById = async (req, res, next) => {
    try {
      const product = await this.productService.getProductById(parseInt(req.params.productId));
      res.status(200).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { id: userId } = res.locals.user;
      await this.productService.updateProduct(parseInt(productId), userId, req.body);
      res.status(200).json({ success: true, message: "상품 정보를 수정하였습니다." });
    } catch (err) {
      next(err);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { id: userId } = res.locals.user;
      await this.productService.deleteProduct(parseInt(productId), userId);
      res.status(200).json({ success: true, message: "상품을 삭제하였습니다." });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ProductController;
