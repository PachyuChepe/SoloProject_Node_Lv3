// routes/products.router.js

const express = require("express");

const router = express.Router();
const { User, Product, Sequelize } = require("../sequelize/models/index.js");
const { isLoggedIn } = require("../middleware/verifyToken.middleware.js");

// Create (상품 등록)
router.post("/product", isLoggedIn, async (req, res) => {
  const { id } = res.locals.user;
  const { title, content } = req.body;

  try {
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "필수 입력 정보가 누락되었습니다." });
    }

    const newItem = await Product.create({
      title,
      content,
      user_id: id,
    });

    if (!newItem) {
      return res.status(500).json({ success: false, message: "상품을 생성할 수 없습니다." });
    }

    return res.status(201).json({ success: true, message: "판매 상품을 등록하였습니다.", data: newItem });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ success: false, message: "상품 등록에 실패하였습니다." });
  }
});

// Read (상품 목록 조회)
router.get("/products", async (req, res) => {
  const sort = req.query.sort ? req.query.sort.toUpperCase() : "DESC";

  if (sort !== "ASC" && sort !== "DESC") {
    return res.status(400).json({ success: false, message: "잘못된 정렬 방식입니다." });
  }

  try {
    const getProduct = await User.findAll({
      attributes: ["name"],
      order: [[{ model: Product }, "createdAt", sort]],
      include: [
        {
          model: Product,
          attributes: ["id", "title", "content", "status", "createdAt"],
        },
      ],
    });

    if (getProduct.length === 0) {
      return res.status(404).send({ success: false, message: "상품이 존재하지 않습니다." });
    }

    return res.status(200).json({ success: true, data: getProduct });
  } catch (err) {
    // console.error(err);
    return res.status(500).json({ success: false, message: "상품 목록 조회에 실패하였습니다." });
  }
});

// Read (상품 상세 조회)
router.get("/product/:productId", async (req, res) => {
  const { productId } = req.params;

  if (isNaN(productId)) {
    return res.status(400).json({ success: false, message: "잘못된 상품 ID입니다." });
  }

  try {
    const getProduct = await Product.findOne({
      attributes: ["id", "title", "content", "status", "createdAt"],
      where: { id: productId },
      include: [
        {
          model: User,
          attributes: ["name"],
          where: {
            id: Sequelize.col("Product.user_id"),
          },
        },
      ],
    });

    if (!getProduct) {
      return res.status(404).json({ success: false, message: "상품이 존재하지 않습니다." });
    }

    return res.status(200).json({ success: true, data: getProduct });
  } catch (err) {
    // console.log("조회 실패", err);
    return res.status(500).json({ success: false, message: "상품 조회에 실패하였습니다." });
  }
});

// Update (상품 정보 수정)
router.put("/product/:productId", isLoggedIn, async (req, res) => {
  const { productId } = req.params;
  const { id } = res.locals.user;
  const { title, content, status } = req.body;

  if (!title || !content || !status) {
    return res.status(400).json({ success: false, message: "필수 입력 정보가 누락되었습니다." });
  }

  try {
    const updateProduct = await Product.update({ title, content, status }, { where: { id: productId, user_id: id } });

    if (updateProduct[0] === 0) {
      return res.status(404).json({ success: false, message: "상품이 존재하지 않습니다." });
    }

    return res.status(200).json({ success: true, message: "상품 정보를 수정하였습니다." });
  } catch (err) {
    // console.log("뭐가문젠데", err);
    return res.status(500).json({ success: false, message: "상품 수정에 실패하였습니다." });
  }
});

// Delete (상품 삭제)
router.delete("/product/:productId", isLoggedIn, async (req, res) => {
  const { productId } = req.params;
  const { id } = res.locals.user;

  if (isNaN(productId)) {
    return res.status(400).json({ success: false, message: "잘못된 상품 ID입니다." });
  }

  try {
    const deleteItem = await Product.destroy({
      where: { id: productId, user_id: id },
    });

    if (!deleteItem) {
      return res.status(404).json({ success: false, message: "상품이 존재하지 않습니다." });
    }

    return res.status(200).json({ success: true, message: "상품을 삭제하였습니다." });
  } catch (err) {
    // console.log("뭐가문제임", err);
    return res.status(500).json({ success: false, message: "상품 삭제에 실패하였습니다." });
  }
});

module.exports = router;
