const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
});

postSchema.set('timestamps', { createdAt: true, updatedAt: false });

module.exports = mongoose.model('Comment', commentSchema);
