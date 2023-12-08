// controller/user.controller.js

const UserService = require("../service/user.service.js");
const redisClient = require("../redis/redisClient.js");

// 사용자 관련 HTTP 요청을 처리하는 컨트롤러
class UserController {
  constructor() {
    this.userService = new UserService();
  }

  // 새 사용자를 등록하고 생성된 사용자 정보를 반환
  signUp = async (req, res, next) => {
    try {
      const userData = await this.userService.signUp(req.body);
      const { password, ...data } = userData;

      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  // 사용자 로그인을 처리하고 토큰을 반환
  login = async (req, res, next) => {
    try {
      const { accessToken } = await this.userService.login(req.body);
      res.cookie("Authorization", `Bearer ${accessToken}`);

      res.status(200).json({ success: true, message: "로그인 성공", accessToken });
    } catch (error) {
      next(error);
    }
  };

  // 현재 로그인된 사용자의 정보를 조회하고 반환
  getUser = async (req, res, next) => {
    try {
      const user = await this.userService.getUser(res.locals.user.id);
      // const { password, ...data } = user;
      const userData = {
        email: user.email,
        name: user.name,
      };

      res.status(200).json({ success: true, data: userData });
    } catch (error) {
      next(error);
    }
  };

  // 사용자 정보를 업데이트하고 결과를 반환
  updateUser = async (req, res, next) => {
    try {
      await this.userService.updateUser(res.locals.user.id, req.body);

      res.status(200).json({ success: true, message: "사용자 정보가 성공적으로 업데이트되었습니다." });
    } catch (error) {
      next(error);
    }
  };

  // 사용자를 삭제하고 결과를 반환
  deleteUser = async (req, res, next) => {
    try {
      await this.userService.deleteUser(res.locals.user.id);
      res.clearCookie("Authorization");
      await redisClient.del(res.locals.user.id.toString());

      res.status(200).json({ success: true, message: "회원 탈퇴가 성공적으로 처리되었습니다." });
    } catch (error) {
      next(error);
    }
  };

  // 사용자 로그아웃을 처리하고 결과를 반환
  logout = async (req, res, next) => {
    try {
      await redisClient.del(res.locals.user.id.toString());
      res.clearCookie("Authorization");

      res.status(200).json({ success: true, message: "로그아웃 성공" });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;

// Controller Layer의 역할
// HTTP 요청을 받고 적절한 응답을 반환
// 사용자의 입력을 처리하고, 해당 입력을 서비스 계층으로 전달하며, 서비스 계층의 결과를 클라이언트에게 응답

// Controller Layer의 특징
// 웹 요청과 응답에 관한 로직만 포함하며, 비즈니스 로직은 포함하지 않음

// 클래스 및 화살표 함수 사용 이유
// 1. 클래스 사용
// 클래스를 사용하면 코드의 재사용성, 가독성, 유지 보수가 쉬움
// 클래스는 관련된 데이터와 함수를 함께 묶어주며, 객체 지향 프로그래밍의 이점을 제공

// 2. 화살표 함수
// 화살표 함수는 간결한 문법을 가지고 있으며, this의 범위가 렉시컬 범위로 한정되어 클래스 내에서 this의 혼란을 줄일 수 있음
