// repository/user.repository.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 데이터베이스에서 사용자 관련 작업을 수행하는 리포지토리 클래스
class UserRepository {
  /**
   * 이메일로 사용자를 찾음
   * @param {string} email - 사용자 이메일
   * @returns {Promise<object>} 조회된 사용자 정보
   */
  findUserByEmail = async (email) => {
    return await prisma.user.findUnique({ where: { email } });
  };

  /**
   * 새 사용자를 데이터베이스에 추가
   * @param {object} userData - 사용자 데이터
   * @returns {Promise<object>} 생성된 사용자 정보
   */
  createUser = async (userData) => {
    return await prisma.user.create({ data: userData });
  };

  /**
   * 사용자 정보 업데이트
   * @param {number} id - 사용자 ID
   * @param {object} updateData - 업데이트할 사용자 데이터
   * @returns {Promise<object>} 업데이트된 사용자 정보
   */
  updateUser = async (id, updateData) => {
    return await prisma.user.update({ where: { id }, data: updateData });
  };

  /**
   * 사용자 삭제
   * @param {number} id - 사용자 ID
   * @returns {Promise<object>} 삭제 결과
   */
  deleteUser = async (id) => {
    return await prisma.user.delete({ where: { id } });
  };

  /**
   * ID로 사용자를 찾음
   * @param {number} id - 사용자 ID
   * @returns {Promise<object>} 조회된 사용자 정보
   */
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
