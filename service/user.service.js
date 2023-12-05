const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../config/env.config.js");
const UserRepository = require("../repository/user.repository.js");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  signUp = async ({ email, password, name }) => {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("이미 사용 중인 이메일입니다");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userRepository.createUser({
      email,
      password: hashedPassword,
      name,
    });
  };

  login = async ({ email, password }) => {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("사용자 정보를 찾을 수 없습니다.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("패스워드가 일치하지 않습니다.");
    }

    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: "12h" });
    return { token, user };
  };

  getUser = async (id) => {
    return await this.userRepository.findUserById(id);
  };

  updateUser = async (id, currentPassword, { newPassword, name }) => {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new Error("사용자 정보를 찾을 수 없습니다.");
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("현재 비밀번호가 일치하지 않습니다.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await this.userRepository.updateUser(id, { password: hashedPassword, name });
  };

  deleteUser = async (id) => {
    return await this.userRepository.deleteUser(id);
  };
}

module.exports = UserService;
