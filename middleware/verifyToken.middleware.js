// middleware/verifyToken.middleware.js

const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const env = require("../config/env.config.js");
const redisClient = require("../redis/redisClient.js");

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
    const decoded = jwt.verify(authToken, env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      throw new jwt.JsonWebTokenError("Invalid token");
    }
    res.locals.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      // 액세스 토큰에서 사용자 ID 추출
      const decoded = jwt.decode(authToken);
      const userId = decoded.userId;

      const refreshToken = await redisClient.get(userId.toString());
      if (!refreshToken) {
        return res.status(401).send({ success: false, message: "재로그인이 필요합니다." });
      }

      try {
        jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

        const newAccessToken = jwt.sign({ userId: userId }, env.JWT_SECRET, { expiresIn: "12h" });
        console.log("재발급되니?", newAccessToken);
        res.cookie("Authorization", `Bearer ${newAccessToken}`);
        const user = await prisma.user.findUnique({ where: { id: userId } });
        res.locals.user = user;
        next();
      } catch (refreshTokenError) {
        await redisClient.del(userId.toString());
        res.clearCookie("Authorization");
        return res.status(401).send({
          success: false,
          message: "재로그인이 필요합니다.",
        });
      }
    } else {
      res.status(500).send({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
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
