// routes/products.router.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { isLoggedIn } = require("../middleware/verifyToken.middleware.js");

// Create (상품 등록)
router.post("/product", isLoggedIn, async (req, res) => {
  const { id: userId } = res.locals.user;
  console.log(res.locals.user);
  const { title, content } = req.body;

  try {
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "필수 입력 정보가 누락되었습니다." });
    }

    const newItem = await prisma.product.create({
      data: {
        title,
        content,
        userId,
      },
    });

    return res.status(201).json({ success: true, message: "판매 상품을 등록하였습니다.", data: newItem });
  } catch (err) {
    return res.status(500).json({ success: false, message: "상품 등록에 실패하였습니다." });
  }
});

// Read (상품 목록 조회)
router.get("/products", async (req, res) => {
  const sort = req.query.sort ? req.query.sort.toUpperCase() : "DESC";

  try {
    const products = await prisma.product.findMany({
      include: {
        user: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: sort.toLowerCase() },
    });

    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    return res.status(500).json({ success: false, message: "상품 목록 조회에 실패하였습니다." });
  }
});

// Read (상품 상세 조회)
router.get("/product/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "상품이 존재하지 않습니다." });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ success: false, message: "상품 조회에 실패하였습니다." });
  }
});

// Update (상품 정보 수정)
router.put("/product/:productId", isLoggedIn, async (req, res) => {
  const { productId } = req.params;
  const { id: userId } = res.locals.user;
  const { title, content, status } = req.body;

  try {
    const updateProduct = await prisma.product.updateMany({
      where: { id: parseInt(productId), userId },
      data: { title, content, status },
    });

    if (updateProduct.count === 0) {
      return res.status(404).json({ success: false, message: "상품이 존재하지 않습니다." });
    }

    return res.status(200).json({ success: true, message: "상품 정보를 수정하였습니다." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "상품 수정에 실패하였습니다." });
  }
});

// Delete (상품 삭제)
router.delete("/product/:productId", isLoggedIn, async (req, res) => {
  const { productId } = req.params;
  const { id: userId } = res.locals.user;

  try {
    const deleteProduct = await prisma.product.deleteMany({
      where: { id: parseInt(productId), userId: userId },
    });

    if (deleteProduct.count === 0) {
      return res.status(404).json({ success: false, message: "상품이 존재하지 않습니다." });
    }

    return res.status(200).json({ success: true, message: "상품을 삭제하였습니다." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "상품 삭제에 실패하였습니다." });
  }
});

module.exports = router;
