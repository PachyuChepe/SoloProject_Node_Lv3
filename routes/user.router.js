// routes/user.router.js

const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("../middleware/verifyToken.middleware.js");
const { validateSignup, validateLogin, validateUpdateUser } = require("../middleware/user.validation.middleware.js");
const UserController = require("../controller/user.controller.js");

const userController = new UserController();

router.post("/signup", isNotLoggedIn, validateSignup, userController.signUp);
router.post("/login", isNotLoggedIn, validateLogin, userController.login);
router.get("/user", isLoggedIn, userController.getUser);
router.put("/user", isLoggedIn, validateUpdateUser, userController.updateUser);
router.delete("/user", isLoggedIn, userController.deleteUser);
router.post("/logout", isLoggedIn, userController.logout);

module.exports = router;

// // routes/user.router.js

// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
// const env = require("../config/env.config.js");
// const { isLoggedIn, isNotLoggedIn } = require("../middleware/verifyToken.middleware.js");

// // 회원가입
// router.post("/signup", isNotLoggedIn, async (req, res) => {
//   const { email, password, confirmPassword, name } = req.body;
//   try {
//     // 필수 입력 값, 이메일 형식, 비밀번호 강도, 일치 검증 등

//     // 이메일 중복 확인
//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) {
//       return res.status(409).json({ success: false, message: "이미 사용 중인 이메일입니다" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await prisma.user.create({ data: { email, password: hashedPassword, name } });

//     const { password: _, ...userData } = user;
//     return res.status(201).json({ success: true, data: userData });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
//   }
// });

// // 로그인
// router.post("/login", isNotLoggedIn, async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "사용자 정보를 찾을 수 없습니다." });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ success: false, message: "패스워드가 일치하지 않습니다." });
//     }

//     const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: "12h" });
//     res.cookie("Authorization", `Bearer ${token}`);
//     res.status(200).json({ success: true, message: "로그인 성공", token });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
//   }
// });

// // 사용자 조회
// router.get("/user", isLoggedIn, async (req, res) => {
//   try {
//     const { id } = res.locals.user;
//     const user = await prisma.user.findUnique({ where: { id } });

//     if (!user) {
//       return res.status(404).json({ success: false, message: "사용자 정보를 찾을 수 없습니다" });
//     }

//     const { email, name } = user;
//     res.status(200).json({ success: true, data: { email, name } });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
//   }
// });

// // 회원 정보 수정
// router.put("/user", isLoggedIn, async (req, res) => {
//   const { id } = res.locals.user;
//   const { currentPassword, newPassword, name } = req.body;
//   try {
//     const user = await prisma.user.findUnique({ where: { id } });

//     if (!user) {
//       return res.status(404).json({ success: false, message: "사용자 정보를 찾을 수 없습니다." });
//     }

//     const passwordValidation = await bcrypt.compare(currentPassword, user.password);
//     if (!passwordValidation) {
//       return res.status(401).json({ success: false, message: "현재 비밀번호가 일치하지 않습니다." });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await prisma.user.update({ where: { id }, data: { password: hashedPassword, name } });

//     res.status(200).json({ success: true, message: "사용자 정보가 성공적으로 업데이트되었습니다." });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
//   }
// });

// // 회원 탈퇴
// router.delete("/user", isLoggedIn, async (req, res) => {
//   const { id } = res.locals.user;
//   try {
//     await prisma.user.delete({ where: { id } });
//     res.clearCookie("Authorization");
//     res.status(200).json({ success: true, message: "회원 탈퇴가 성공적으로 처리되었습니다." });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
//   }
// });

// // 로그아웃
// router.post("/logout", isLoggedIn, (req, res) => {
//   res.clearCookie("Authorization");
//   res.status(200).json({ success: true, message: "로그아웃 성공" });
// });

// module.exports = router;
