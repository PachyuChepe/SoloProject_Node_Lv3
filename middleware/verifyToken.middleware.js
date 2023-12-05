const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const env = require("../config/env.config.js");

exports.isLoggedIn = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [authType, authToken] = (Authorization ?? "").split(" ");

  if (!authToken || authType !== "Bearer") {
    return res.status(401).send({
      success: false,
      message: "로그인이 필요합니다.",
    });
  }

  try {
    const { userId } = jwt.verify(authToken, env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "인증된 사용자를 찾을 수 없습니다.",
      });
    }
    res.locals.user = user;
    next();
  } catch (err) {
    // 기존의 catch 블록 로직 유지
  }
};

exports.isNotLoggedIn = async (req, res, next) => {
  const { Authorization } = req.cookies;

  const [authType, authToken] = (Authorization ?? "").split(" ");

  if (!authToken || authType !== "Bearer") {
    next();
    return;
  }
  try {
    jwt.verify(authToken, env.JWT_SECRET);

    res.status(401).send({
      success: false,
      message: "이미 로그인된 상태입니다",
    });
  } catch (error) {
    next();
  }
};
