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
router.get('/posts/:_postId', async (req, res) => {
  if (!req.params || !req.body) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }
  const { _postId } = req.params;
  const [data] = await Post.find({ _id: _postId });

  res.status(200).json({ data });
});

// 게시글 생성
router.post('/posts', async (req, res) => {
  const { user, password, title, content } = req.body;
  if (!password || !title || !content || !password) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }
  await Post.create({
    user,
    password,
    title,
    content,
  });

  res.json({ message: '게시글을 생성하였습니다.' });
});

// 게시글 수정
router.put('/posts/:_postId', async (req, res) => {
  if (!req.params || !req.body) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }
  const { _postId } = req.params;
  const { password, title, content } = req.body;
  if (!password || !title || !content) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }
  const data = await Post.find({ _id: _postId });
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
      { _id: _postId },
      { $set: { title: title } },
      { $set: { content: content } }
    );
    res.status(200).json({ message: '게시글을 수정하였습니다.' });
  }
});

// 게시글 삭제
router.delete('/posts/:_postId', async (req, res) => {
  const { _postId } = req.params;
  const { password } = req.body;
  const deletePost = await Post.find({ _id: _postId });
  const pass = deletePost[0].password;

  if (password !== pass) {
    res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    return;
  }
  if (deletePost.length) {
    await Post.deleteOne({ _id: _postId });
  }
  res.status(200).json({ message: '게시글을 삭제하였습니다.' });
});

module.exports = router;
