const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../config/env.config.js");
const authenticateToken = require("../middleware/login-middleware.js");

// 회원 가입
router.post("/signup", async (req, res) => {
  try {
    const { email, password, confirmPassword, name } = req.body;
    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    // 이메일 중복 확인
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });
    // 비밀번호를 제외한 사용자 정보 반환
    const { password: _, ...userData } = user.toJSON();
    res.status(201).json(userData);
  } catch (error) {
    res.status(400).json(error);
  }
});

// 로그인
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    // console.log(user, "유저");
    if (user && (await bcrypt.compare(password, user.password))) {
      // JWT 토큰 생성
      const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: "12h" });
      res.cookie("Authorization", `Bearer ${token}`);
      // res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });
      res.status(200).json({ message: "Login successful", token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

// // 내 정보 조회
// router.get("/me", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findByPk(req.locals.user);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const { password, ...userInfo } = user.toJSON();
//     res.status(200).json(userInfo);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

router.get("/me", authenticateToken, async (req, res) => {
  // 인증 미들웨어를 통해 얻은 사용자 정보를 추출
  const { email, name } = res.locals.user;

  // 사용자 정보를 반환
  res.status(200).json({
    user: { email, name },
  });
});

// 회원 정보 수정
router.put("/users/:id", authenticateToken, async (req, res) => {
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
    res.status(204).send("회원탈퇴성공");
  } catch (error) {
    res.status(400).json(error);
  }
});

// 로그아웃
router.post("/logout", (req, res) => {
  res.clearCookie("Authorization");
  res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
