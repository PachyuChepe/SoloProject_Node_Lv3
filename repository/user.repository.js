// repository/user.repository.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class UserRepository {
  findUserByEmail = async (email) => {
    return await prisma.user.findUnique({ where: { email } });
  };

  createUser = async (userData) => {
    return await prisma.user.create({ data: userData });
  };

  updateUser = async (id, updateData) => {
    return await prisma.user.update({ where: { id }, data: updateData });
  };

  deleteUser = async (id) => {
    return await prisma.user.delete({ where: { id } });
  };

  findUserById = async (id) => {
    return await prisma.user.findUnique({ where: { id } });
  };
}

module.exports = UserRepository;

// Repository Layer 역할
// 데이터베이스와 직접적으로 상호작용 하는 계층
// 데이터의 조회, 저장, 수정, 삭제 등을 담당

// Repository Layer 특징
// 데이터베이스에 대한 모든 엑세스를 캡슐화하며, 데이터베이스와의 모든 상호작용을 관리

// 클래스 및 화살표 함수 사용 이유
// 1. 클래스 사용
// 클래스를 사용하면 코드의 재사용성, 가독성, 유지 보수가 쉬움
// 클래스는 관련된 데이터와 함수를 함께 묶어주며, 객체 지향 프로그래밍의 이점을 제공

// 2. 화살표 함수
// 화살표 함수는 간결한 문법을 가지고 있으며, this의 범위가 렉시컬 범위로 한정되어 클래스 내에서 this의 혼란을 줄일 수 있음
