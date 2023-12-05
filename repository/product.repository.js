const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ProductRepository {
  createProduct = async (data) => {
    return await prisma.product.create({ data });
  };

  findAllProducts = async (sort) => {
    return await prisma.product.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: sort.toLowerCase() },
    });
  };

  findProductById = async (id) => {
    return await prisma.product.findUnique({
      where: { id },
      include: { user: { select: { name: true } } },
    });
  };

  updateProduct = async (id, userId, data) => {
    return await prisma.product.updateMany({
      where: { id, userId },
      data,
    });
  };

  deleteProduct = async (id, userId) => {
    return await prisma.product.deleteMany({
      where: { id, userId },
    });
  };
}

module.exports = ProductRepository;
