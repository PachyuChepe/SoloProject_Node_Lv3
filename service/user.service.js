// service/user.service.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../config/env.config.js");
const UserRepository = require("../repository/user.repository.js");
const ApiError = require("../middleware/apiError.middleware.js");
const redisClient = require("../redis/redisClient.js");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  signUp = async ({ email, password, confirmPassword, name }) => {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw ApiError.Conflict("이미 사용 중인 이메일입니다.");
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
      throw ApiError.NotFound("사용자 정보를 찾을 수 없습니다.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.Unauthorized("패스워드가 일치하지 않습니다.");
    }

    const accessToken = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: "10s" });
    const refreshToken = jwt.sign({ userId: user.id }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    await redisClient.set(user.id.toString(), refreshToken, "EX", 60 * 60 * 24 * 7);

    return { accessToken, user };
  };

  getUser = async (id) => {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw ApiError.NotFound("사용자 정보를 찾을 수 없습니다");
    }
    return user;
  };

  updateUser = async (id, { currentPassword, newPassword, name }) => {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw ApiError.NotFound("사용자 정보를 찾을 수 없습니다.");
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw ApiError.Unauthorized("현재 비밀번호가 일치하지 않습니다.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await this.userRepository.updateUser(id, { password: hashedPassword, name });
  };

  deleteUser = async (id) => {
    return await this.userRepository.deleteUser(id);
  };
}

module.exports = UserService;

// Service Layer 역할
// 비즈니스 로직을 수행
// 애플리케이션의 핵심 기능을 구현하고, 데이터 처리 및 계산 등을 담당

// Service Layer 특징
// 서비스 계층은 데이터베이스와 직접적으로 상호작용하지 않지만 리포지토리 계층에 데이터베이스와의 상호작용을 위임

// 클래스 및 화살표 함수 사용 이유
// 1. 클래스 사용
// 클래스를 사용하면 코드의 재사용성, 가독성, 유지 보수가 쉬움
// 클래스는 관련된 데이터와 함수를 함께 묶어주며, 객체 지향 프로그래밍의 이점을 제공

// 2. 화살표 함수
// 화살표 함수는 간결한 문법을 가지고 있으며, this의 범위가 렉시컬 범위로 한정되어 클래스 내에서 this의 혼란을 줄일 수 있음
