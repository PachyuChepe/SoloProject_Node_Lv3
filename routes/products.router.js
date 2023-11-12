const express = require("express");
const router = express.Router();
const { User, Items, Sequelize } = require("../sequelize/models/index.js");
// const UserItem = require("../schemas/productsSchema");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
// const { Sequelize } = require("sequelize");
const { isLoggedIn, isNotLoggedIn } = require("../middleware/verifyToken.middleware.js");

// Create (상품 등록)
router.post("/product", isLoggedIn, async (req, res) => {
  const { id } = res.locals.user;
  const { title, content, status } = req.body;

  try {
    // const user = await User.findByPk(id);

    if (!title || !content) {
      return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    const newItem = await Items.create({
      title,
      content,
      user_id: id,
    });

    return res.status(201).json({ message: "판매 상품을 등록하였습니다.", item: newItem });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "상품 등록에 실패하였습니다." });
  }
});

// Read (상품 목록 조회)
// 완성 들됨
router.get("/products", async (req, res) => {
  // const { id } = res.locals.user;
  const sort = req.query.sort ? req.query.sort.toUpperCase() : "DESC";

  try {
    const getItems = await User.findAll({
      attributes: ["name"],
      order: [[{ model: Items }, "createdAt", sort]], // 이 위치에 order 옵션을 추가
      // where: { id },
      include: [
        {
          model: Items,
          attributes: ["id", "title", "content", "status", "createdAt"],
          // where: { user_id: id },
        },
      ],
    });
    return res.status(200).json({ data: getItems });
  } catch (err) {
    return res.status(500).json({ message: "상품 목록 조회에 실패하였습니다." });
  }
});

// Read (상품 상세 조회)
router.get("/product/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  // const { id } = res.locals.user;
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
    // const getItem = await User.findOne({
    //   attributes: ["name"],
    //   where: {
    //     id: itemId,
    //   },
    //   include: [
    //     {
    //       model: Items,
    //       where: {
    //         user_id: id,
    //         id: itemId,
    //       },
    //       attributes: ["id", "title", "status", "createdAt"],
    //     },
    //   ],
    // });
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
    const updateItems = await Items.update(
      {
        title,
        content,
        status,
      },
      {
        where: { id: itemId, user_id: id },
      }
    );
    if (!updateItems) {
      return res.status(404).json({ message: "상품이 존재하지 않습니다." });
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

  try {
    const deleteItem = await Items.destroy({
      where: { id: itemId, user_id: id },
    });
    if (!deleteItem) {
      return res.status(404).json({ message: "상품이 존재하지 않습니다." });
    }
    return res.status(200).json({ message: "상품을 삭제하였습니다." });
  } catch (err) {
    console.log("뭐가문제임", err);
    return res.status(500).json({ message: "상품 삭제에 실패하였습니다." });
  }
});

module.exports = router;
