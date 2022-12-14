const express = require('express');
const router = express.Router();
const Post = require('../schemas/post');

// 전체 게시글 조회
router.get('/posts', async (req, res) => {
  const posts = await Post.find(
    {},
    { _id: 1, title: 1, user: 1, createdAt: 1 }
  ).sort({
    createdAt: -1,
  });
  res.json({ posts: posts });
});

// 게시글 상세 조회
router.get('/posts/:_id', async (req, res) => {
  if (!req.params || !req.body) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }
  const { _id } = req.params;
  const [data] = await Post.find({ _id });

  res.status(200).json({ data });
});

// 게시글 생성
router.post('/posts', async (req, res) => {
  const { user, password, title, content } = req.body;
  if (!password || !title || !content || !password) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }
  const createPosts = await Post.create({
    user,
    password,
    title,
    content,
  });

  res.json({ posts: createPosts });
});

// 게시글 수정
router.put('/posts/:_id', async (req, res) => {
  if (!req.params || !req.body) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }
  const { _id } = req.params;
  const { password, title, content } = req.body;
  if (!password || !title || !content) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }
  console.log(req.body);
  const data = await Post.find({ _id });
  if (!data.length) {
    res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
    return;
  }
  const pass = data[0].password;

  if (password !== pass) {
    res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    return;
  } else if (password === pass) {
    await Post.updateOne(
      { password: password },
      { $set: { title: title } },
      { $set: { content: content } }
    );
    res.status(200).json({ message: '게시글을 수정하였습니다.' });
  }
});

// 게시글 삭제
router.delete('/posts/:_id', async (req, res) => {
  const { _id } = req.params;
  const deletePost = await Post.find({ _id });
  if (deletePost.length) {
    await Post.deleteOne({ _id });
  }
  res.status(200).json({ message: '게시글을 삭제하였습니다.' });
});

module.exports = router;