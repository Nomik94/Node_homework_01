const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment');
const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

// 댓글 목록 조회
router.get('/comments/:_postId', async (req, res) => {
  const { _postId } = req.params;
  const comment = await Comment.find({ _postId: _postId }).sort({
    createdAt: -1,
  });
  const data = comment.map((a) => {
    return {
      commentId: a._id,
      user: a.user,
      content: a.content,
      createdAt: a.createdAt,
    };
  });
  res.json({ data: data });
});

// 댓글 생성
router.post('/comments/:_postId', async (req, res) => {
  const { _postId } = req.params;
  const { user, password, content } = req.body;
  if (!password || !user) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }

  if (!content) {
    res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    return;
  }

  await Comment.create({
    _postId,
    user,
    password,
    content,
  });
  res.json({ message: '댓글을 생성하였습니다.' });
});

// 댓글 수정
router.put('/comments/:_commentId', async (req, res) => {
  if (!req.params || !req.body) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }
  const { _commentId } = req.params;
  const { password, content } = req.body;
  if (!content) {
    res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    return;
  }
  const data = await Comment.find({ _id: _commentId });
  if (!data.length) {
    res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
    return;
  }
  const pass = data[0].password;

  if (password !== pass) {
    res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    return;
  } else if (password === pass) {
    await Comment.updateOne(
      { _id: _commentId },
      { $set: { content: content } }
    );
    res.status(200).json({ message: '댓글을 수정하였습니다.' });
  }
});

// 댓글 삭제
router.delete('/comments/:_commentId', async (req, res) => {
  const { _commentId } = req.params;
  const { password } = req.body;
  const deleteComment = await Comment.find({ _id: _commentId });
  const pass = deleteComment[0].password;
  if (!password) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }

  if (password !== pass) {
    res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    return;
  }
  if (deleteComment.length) {
    await Comment.deleteOne({ _id: _commentId });
  }
  res.status(200).json({ message: '댓글을 삭제하였습니다.' });
});

module.exports = router;
