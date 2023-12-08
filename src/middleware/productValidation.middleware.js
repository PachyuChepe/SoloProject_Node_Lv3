// middleware/productValidation.middleware.js

const ApiError = require("./apiError.middleware.js");

// 상품 생성 요청의 유효성을 검증하는 미들웨어
const validateCreateProduct = (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    throw ApiError.BadRequest("필수 입력 정보가 누락되었습니다.");
  }

  next();
};

// 상품 목록 조회 요청의 유효성을 검증하는 미들웨어
const validateGetAllProducts = (req, res, next) => {
  const sort = req.query.sort ? req.query.sort.toUpperCase() : "DESC";

  if (sort !== "ASC" && sort !== "DESC") {
    throw ApiError.BadRequest("잘못된 정렬 방식입니다.");
  }

  next();
};

// 상품 ID의 유효성을 검증하는 미들웨어
const validateProductId = (req, res, next) => {
  const { productId } = req.params;

  if (isNaN(productId)) {
    throw ApiError.BadRequest("잘못된 상품 ID입니다.");
  }

  next();
};

// 상품 업데이트 요청의 유효성을 검증하는 미들웨어
const validateUpdateProduct = (req, res, next) => {
  const { title, content, status } = req.body;

  if (!title || !content || !status) {
    throw ApiError.BadRequest("필수 입력 정보가 누락되었습니다.");
  }

  next();
};

// 상품 삭제 요청의 유효성을 검증하는 미들웨어
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
