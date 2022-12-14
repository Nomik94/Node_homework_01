const express = require('express');
const app = express();
const port = 3000;

const postsRouter = require('./routes/posts');
// const commentsRouter = require('./routes/comments');
const connect = require('./schemas');
connect();

app.use(express.json());
app.use('/api', [postsRouter]);

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸습니다.');
});