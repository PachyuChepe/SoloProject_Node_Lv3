// middleware/product.validation.middleware.js

const ApiError = require("./apiError.middleware.js");

const validateCreateProduct = (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    throw ApiError.BadRequest("제목과 내용은 필수 항목입니다.");
  }

  next();
};

const validateGetAllProducts = (req, res, next) => {
  const sort = req.query.sort ? req.query.sort.toUpperCase() : "DESC";

  if (sort !== "ASC" && sort !== "DESC") {
    throw ApiError.BadRequest("잘못된 정렬 방식입니다.");
  }

  next();
};

const validateProductId = (req, res, next) => {
  const { productId } = req.params;

  if (isNaN(productId)) {
    throw ApiError.BadRequest("잘못된 상품 ID입니다.");
  }

  next();
};

const validateUpdateProduct = (req, res, next) => {
  const { title, content, status } = req.body;

  if (!title || !content || !status) {
    throw ApiError.BadRequest("제목, 내용, 상태는 필수 항목입니다.");
  }

  next();
};

const validateDeleteProduct = (req, res, next) => {
  const { productId } = req.params;

  if (isNaN(productId)) {
    throw ApiError.BadRequest("잘못된 상품 ID입니다.");
  }

  next();
};

module.exports = {
  validateCreateProduct,
  validateGetAllProducts,
  validateProductId,
  validateUpdateProduct,
  validateDeleteProduct,
};
