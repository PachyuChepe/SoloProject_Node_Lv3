// controller/user.controller.js

const UserService = require("../service/user.service.js");
const redisClient = require("../redis/redisClient.js");

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  signUp = async (req, res, next) => {
    try {
      const userData = await this.userService.signUp(req.body);
      const { password, ...data } = userData;
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { accessToken, user } = await this.userService.login(req.body);
      res.cookie("Authorization", `Bearer ${accessToken}`);
      res.status(200).json({ success: true, message: "로그인 성공", accessToken, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req, res, next) => {
    try {
      const user = await this.userService.getUser(res.locals.user.id);
      const { password, ...data } = user;
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  // getUser = async (req, res, next) => {
  //   try {
  //     const user = await this.userService.getUser(res.locals.user.id);
  //     if (!user) {
  //       return res.status(404).json({ success: false, message: "사용자 정보를 찾을 수 없습니다" });
  //     }
  //     const { password, ...data } = user;
  //     res.status(200).json({ success: true, data });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  updateUser = async (req, res, next) => {
    try {
      await this.userService.updateUser(res.locals.user.id, req.body);
      res.status(200).json({ success: true, message: "사용자 정보가 성공적으로 업데이트되었습니다." });
    } catch (error) {
      next(error);
    }
  };

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

  logout = async (req, res, next) => {
    try {
      // 사용자 ID를 통해 리프레시 토큰 삭제
      await redisClient.del(res.locals.user.id.toString());

      // 클라이언트 측 쿠키 삭제
      res.clearCookie("Authorization");

      res.status(200).json({ success: true, message: "로그아웃 성공" });
    } catch (error) {
      next(error);
    }
  };

  // logout = (req, res) => {
  //   res.clearCookie("Authorization");
  //   console.log(res);
  //   res.status(200).json({ success: true, message: "로그아웃 성공" });
  // };
}

module.exports = UserController;

// const UserService = require("../service/user.service.js");

// class UserController {
//   constructor() {
//     this.userService = new UserService();
//   }

//   signUp = async (req, res) => {
//     try {
//       const userData = await this.userService.signUp(req.body);
//       const { password, ...data } = userData;
//       res.status(201).json({ success: true, data });
//     } catch (error) {
//       res.status(409).json({ success: false, message: error.message });
//     }
//   };

//   login = async (req, res) => {
//     try {
//       const { token, user } = await this.userService.login(req.body);
//       res.cookie("Authorization", `Bearer ${token}`);
//       res.status(200).json({ success: true, message: "로그인 성공", token, user: { id: user.id, email: user.email, name: user.name } });
//     } catch (error) {
//       res.status(401).json({ success: false, message: error.message });
//     }
//   };

//   getUser = async (req, res) => {
//     try {
//       const user = await this.userService.getUser(res.locals.user.id);
//       if (!user) {
//         return res.status(404).json({ success: false, message: "사용자 정보를 찾을 수 없습니다" });
//       }
//       const { password, ...data } = user;
//       res.status(200).json({ success: true, data });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };

//   updateUser = async (req, res) => {
//     try {
//       await this.userService.updateUser(res.locals.user.id, req.body.currentPassword, req.body);
//       res.status(200).json({ success: true, message: "사용자 정보가 성공적으로 업데이트되었습니다." });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };

//   deleteUser = async (req, res) => {
//     try {
//       await this.userService.deleteUser(res.locals.user.id);
//       res.clearCookie("Authorization");
//       res.status(200).json({ success: true, message: "회원 탈퇴가 성공적으로 처리되었습니다." });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };

//   logout = (req, res) => {
//     res.clearCookie("Authorization");
//     res.status(200).json({ success: true, message: "로그아웃 성공" });
//   };
// }

// module.exports = UserController;

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
