const express = require("express");
const router = express.Router();
const { User, Items, Sequelize } = require("../sequelize/models/index.js");
const { isLoggedIn } = require("../middleware/verifyToken.middleware.js");

// Create (상품 등록)
router.post("/product", isLoggedIn, async (req, res) => {
  const { id } = res.locals.user;
  const { title, content, status } = req.body;

  try {
    if (!title || !content) {
      return res.status(400).json({ message: "제목과 내용은 필수입니다." });
    }

    const newItem = await Items.create({
      title,
      content,
      user_id: id,
    });

    if (!newItem) {
      return res.status(500).json({ message: "상품을 생성할 수 없습니다." });
    }

    return res.status(201).json({ message: "판매 상품을 등록하였습니다.", item: newItem });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "상품 등록에 실패하였습니다." });
  }
});

// Read (상품 목록 조회)
router.get("/products", async (req, res) => {
  const sort = req.query.sort ? req.query.sort.toUpperCase() : "DESC";

  if (sort !== "ASC" && sort !== "DESC") {
    return res.status(400).json({ message: "잘못된 정렬 방식입니다." });
  }

  try {
    const getItems = await User.findAll({
      attributes: ["name"],
      order: [[{ model: Items }, "createdAt", sort]],
      include: [
        {
          model: Items,
          attributes: ["id", "title", "content", "status", "createdAt"],
        },
      ],
    });

    if (getItems.length === 0) {
      return res.status(204).send({ message: "등록된 상품이 없습니다." });
    }

    return res.status(200).json({ data: getItems });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "상품 목록 조회에 실패하였습니다." });
  }
});

// Read (상품 상세 조회)
router.get("/product/:itemId", async (req, res) => {
  const itemId = req.params.itemId;

  if (isNaN(itemId)) {
    return res.status(400).json({ message: "잘못된 상품 ID입니다." });
  }

  try {
    const getItem = await Items.findOne({
      attributes: ["id", "title", "status", "createdAt"],
      where: { id: itemId },
      include: [
        {
          model: User,
          attributes: ["name"],
          where: {
            id: Sequelize.col("Items.user_id"),
          },
        },
      ],
    });

    if (!getItem) {
      return res.status(404).json({ message: "상품이 존재하지 않습니다." });
    }

    return res.status(200).json({ data: getItem });
  } catch (err) {
    console.log("조회 실패", err);
    return res.status(500).json({ message: "상품 조회에 실패하였습니다." });
  }
});

// Update (상품 정보 수정)
router.put("/product/:itemId", isLoggedIn, async (req, res) => {
  const itemId = req.params.itemId;
  const { id } = res.locals.user;
  const { title, content, status } = req.body;

  if (!title || !content || !status) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  try {
    const updateItems = await Items.update({ title, content, status }, { where: { id: itemId, user_id: id } });

    if (updateItems[0] === 0) {
      return res.status(404).json({ message: "상품이 존재하지 않거나 권한이 없습니다." });
    }

    return res.status(200).json({ message: "상품 정보를 수정하였습니다." });
  } catch (err) {
    console.log("뭐가문젠데", err);
    return res.status(500).json({ message: "상품 수정에 실패하였습니다." });
  }
});

// Delete (상품 삭제)
router.delete("/product/:itemId", isLoggedIn, async (req, res) => {
  const itemId = req.params.itemId;
  const { id } = res.locals.user;

  if (isNaN(itemId)) {
    return res.status(400).json({ message: "잘못된 상품 ID입니다." });
  }

  try {
    const deleteItem = await Items.destroy({
      where: { id: itemId, user_id: id },
    });

    if (!deleteItem) {
      return res.status(404).json({ message: "상품이 존재하지 않거나 권한이 없습니다." });
    }

    return res.status(200).json({ message: "상품을 삭제하였습니다." });
  } catch (err) {
    console.log("뭐가문제임", err);
    return res.status(500).json({ message: "상품 삭제에 실패하였습니다." });
  }
});

module.exports = router;
