const jwt = require("jsonwebtoken"); // JWT 처리를 위한 모듈
const { User } = require("../models"); // Sequelize User 모델
const env = require("../config/env.config.js");

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
  // 요청에서 쿠키를 가져옴
  const { Authorization } = req.cookies;
  console.log(Authorization, "???");

  // 쿠키에서 인증 타입과 토큰을 분리
  const [authType, authToken] = (Authorization ?? "").split(" ");

  // 토큰이 없거나 인증 타입이 'Bearer'가 아니면 오류 메시지를 반환
  if (!authToken || authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }

  try {
    // JWT를 검증하고, 토큰에 담긴 사용자 ID를 추출
    const { userId } = jwt.verify(authToken, env.JWT_SECRET);

    // 사용자 ID로 데이터베이스에서 사용자를 찾음
    const user = await User.findByPk(userId);
    console.log(user, "들어오긴함?");

    // 찾은 사용자 정보를 응답 객체의 로컬 변수에 저장
    res.locals.user = user;

    // 다음 미들웨어를 실행합니다.
    next();
  } catch (err) {
    // JWT 검증에 실패하면 오류를 로깅하고 오류 메시지를 반환
    console.error(err);
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};
