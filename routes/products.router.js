// routes/products.router.js

const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/verifyToken.middleware.js");
const ProductController = require("../controller/product.controller.js");
const {
  validateCreateProduct,
  validateGetAllProducts,
  validateProductId,
  validateUpdateProduct,
  validateDeleteProduct,
} = require("../middleware/productValidation.middleware.js");

const productController = new ProductController();

router.post("/product", isLoggedIn, validateCreateProduct, productController.createProduct);
router.get("/products", validateGetAllProducts, productController.getAllProducts);
router.get("/product/:productId", validateProductId, productController.getProductById);
router.put("/product/:productId", validateUpdateProduct, isLoggedIn, productController.updateProduct);
router.delete("/product/:productId", validateDeleteProduct, isLoggedIn, productController.deleteProduct);

module.exports = router;
