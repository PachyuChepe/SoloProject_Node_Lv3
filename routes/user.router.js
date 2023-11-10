const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// 회원 가입
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

// 로그인
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // 로그인 성공 처리 (세션, 토큰 발급 등)
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(400).json(error);
  }
});

// 회원 정보 수정
router.put("/users/:id", async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.update({ email, name });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

// 회원 탈퇴
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
