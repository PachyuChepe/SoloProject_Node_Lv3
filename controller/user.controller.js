const UserService = require("../service/user.service.js");

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  signUp = async (req, res) => {
    try {
      const userData = await this.userService.signUp(req.body);
      const { password, ...data } = userData;
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(409).json({ success: false, message: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const { token, user } = await this.userService.login(req.body);
      res.cookie("Authorization", `Bearer ${token}`);
      res.status(200).json({ success: true, message: "로그인 성공", token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      res.status(401).json({ success: false, message: error.message });
    }
  };

  getUser = async (req, res) => {
    try {
      const user = await this.userService.getUser(res.locals.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "사용자 정보를 찾을 수 없습니다" });
      }
      const { password, ...data } = user;
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateUser = async (req, res) => {
    try {
      await this.userService.updateUser(res.locals.user.id, req.body.currentPassword, req.body);
      res.status(200).json({ success: true, message: "사용자 정보가 성공적으로 업데이트되었습니다." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  deleteUser = async (req, res) => {
    try {
      await this.userService.deleteUser(res.locals.user.id);
      res.clearCookie("Authorization");
      res.status(200).json({ success: true, message: "회원 탈퇴가 성공적으로 처리되었습니다." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  logout = (req, res) => {
    res.clearCookie("Authorization");
    res.status(200).json({ success: true, message: "로그아웃 성공" });
  };
}

module.exports = UserController;
