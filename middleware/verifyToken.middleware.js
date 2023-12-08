// middleware/verifyToken.middleware.js

const ApiError = require("./apiError.middleware.js");

const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const env = require("../config/env.config.js");
const redisClient = require("../redis/redisClient.js");

// 로그인된 사용자를 확인하는 미들웨어
exports.isLoggedIn = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [authType, authToken] = (Authorization ?? "").split(" ");

  // 토큰 유효성 검증
  if (!authToken || authType !== "Bearer") {
    throw ApiError.Unauthorized("재로그인이 필요합니다.");
    // return res.status(401).send({
    //   success: false,
    //   message: "로그인이 필요합니다.",
    // });
  }

  try {
    const decoded = jwt.verify(authToken, env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      throw new jwt.JsonWebTokenError("Invalid token");
    }
    res.locals.user = user;
    next();
  } catch (err) {
    // 토큰 만료 시 새로운 토큰 생성 및 재검증
    if (err instanceof jwt.TokenExpiredError) {
      const decoded = jwt.decode(authToken);
      const userId = decoded.userId;

      const refreshToken = await redisClient.get(userId.toString());
      if (!refreshToken) {
        throw ApiError.Unauthorized("재로그인이 필요합니다.");
        // return res.status(401).send({ success: false, message: "재로그인이 필요합니다." });
      }

      try {
        jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

        const newAccessToken = jwt.sign({ userId: userId }, env.JWT_SECRET, { expiresIn: "12h" });
        res.cookie("Authorization", `Bearer ${newAccessToken}`);
        const user = await prisma.user.findUnique({ where: { id: userId } });
        res.locals.user = user;
        next();
      } catch (refreshTokenError) {
        await redisClient.del(userId.toString());
        res.clearCookie("Authorization");
        throw ApiError.Unauthorized("재로그인이 필요합니다.");
        // return res.status(401).send({
        //   success: false,
        //   message: "재로그인이 필요합니다.",
        // });
      }
    } else {
      throw ApiError.InternalError("서버 오류가 발생했습니다.");
      // res.status(500).send({
      //   success: false,
      //   message: "서버 오류가 발생했습니다.",
      // });
    }
  }
};

// 로그인되지 않은 사용자를 확인하는 미들웨어
exports.isNotLoggedIn = async (req, res, next) => {
  const { Authorization } = req.cookies;

  const [authType, authToken] = (Authorization ?? "").split(" ");

  if (!authToken || authType !== "Bearer") {
    next();
    return;
  }
  try {
    jwt.verify(authToken, env.JWT_SECRET);
    throw ApiError.Unauthorized("이미 로그인된 상태입니다.");
    // res.status(401).send({
    //   success: false,
    //   message: "이미 로그인된 상태입니다",
    // });
  } catch (error) {
    next();
  }
};
