const jwt = require("jsonwebtoken");
const { User } = require("../models/index.js");
const env = require("../config/env.config.js");

module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [authType, authToken] = (Authorization ?? "").split(" ");

  if (!authToken || authType !== "Bearer") {
    return res.status(401).send({
      errorMessage: "인증 헤더 형식이 올바르지 않습니다.",
    });
  }

  try {
    const { userId } = jwt.verify(authToken, env.JWT_SECRET);
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(401).send({
        errorMessage: "인증된 사용자를 찾을 수 없습니다.",
      });
    }
    res.locals.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.clearCookie("Authorization");
      return res.status(401).send({
        errorMessage: "토큰이 만료되었습니다.",
      });
    } else {
      console.error(err);
      return res.status(500).send({
        errorMessage: "서버 오류가 발생했습니다.",
      });
    }
  }
};
