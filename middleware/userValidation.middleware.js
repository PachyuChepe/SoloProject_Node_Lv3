// middleware/userValidation.middleware.js

const ApiError = require("./apiError.middleware.js");

const validateSignup = (req, res, next) => {
  const { email, password, confirmPassword, name } = req.body;

  if (!email || !password || !confirmPassword || !name) {
    throw ApiError.BadRequest("필수 입력 정보가 누락되었습니다.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw ApiError.BadRequest("유효하지 않은 이메일 형식입니다.");
  }

  if (password !== confirmPassword) {
    throw ApiError.BadRequest("비밀번호가 일치하지 않습니다.");
  }

  if (password.length < 6 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
    throw ApiError.BadRequest("비밀번호는 최소 6자 이상이며, 대소문자, 숫자, 하나 이상의 특수문자를 포함해야 합니다.");
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw ApiError.BadRequest("필수 입력 정보가 누락되었습니다.");
  }

  next();
};

const validateUpdateUser = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw ApiError.BadRequest("필수 입력 정보가 누락되었습니다.");
  }

  if (newPassword.length < 6 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
    throw ApiError.BadRequest("비밀번호는 최소 6자 이상이며, 대소문자, 숫자, 하나 이상의 특수문자를 포함해야 합니다.");
  }

  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateUpdateUser,
};
