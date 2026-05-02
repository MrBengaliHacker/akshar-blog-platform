const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Like', likeSchema);