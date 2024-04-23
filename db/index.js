const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (err) {
    throw err;
  }
};


const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (err) {
    throw err;
  }
};

const getPostById = async (id) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: true, 
      },
    });
    return post;
  } catch (err) {
    throw err;
  }
};

const getAllPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true, 
      },
    });
    return posts;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getUserById,
  getAllUsers,
  getPostById,
  getAllPosts
};