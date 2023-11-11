const jwt = require("jsonwebtoken");
const env = require("../config/env.config.js");

module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;

  const [authType, authToken] = (Authorization ?? "").split(" ");

  if (!authToken || authType !== "Bearer") {
    next();
    return;
  }
  try {
    jwt.verify(authToken, env.JWT_SECRET);

    res.status(401).send({
      errorMessage: "이미 로그인된 상태입니다",
    });
  } catch (error) {
    next();
  }
};
