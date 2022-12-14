const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));

module.exports = router;
