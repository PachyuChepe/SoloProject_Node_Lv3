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
