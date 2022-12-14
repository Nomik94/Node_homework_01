const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment');
const Post = require('../schemas/post');

// 댓글 생성
router.post('/comments/:_id', async (req, res) => {
  const { _id } = req.params;
  const { user, password, content } = req.body;

  if (!content) {
    res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
  }

  const createComments = await Comment.create({
    _id,
    user,
    password,
    content,
  });

  res.json({ comment: createComments });
});

module.exports = router;
