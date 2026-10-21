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

// One like per user and blog. Comment likes (no blogId) are not affected.
likeSchema.index(
  { blogId: 1, userId: 1 },
  { unique: true, partialFilterExpression: { blogId: { $exists: true } } },
);

module.exports = mongoose.model('Like', likeSchema);

module.exports = mongoose.model('Like', likeSchema);