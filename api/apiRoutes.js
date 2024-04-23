const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = 'your_secret_key'; 

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/posts', verifyToken, async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
});

router.get('/posts/:id', verifyToken, async (req, res) => {
  const postId = parseInt(req.params.id);

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
  }
});

router.post('/posts', verifyToken, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: { id: userId },
        },
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
  }
});

router.put('/posts/:id', verifyToken, async (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = req.userId;
  const { title, content } = req.body;

  try {
    const existingPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
      },
    });

    if (existingPost.author.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,
      },
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
  }
});

router.delete('/posts/:id', verifyToken, async (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = req.userId;

  try {
    const existingPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
      },
    });

    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (existingPost.author.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting post:', error);
  }
});

module.exports = router;
