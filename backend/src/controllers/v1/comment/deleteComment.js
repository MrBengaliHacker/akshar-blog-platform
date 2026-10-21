// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const Comment = require('../../../models/comment');
const Blog = require('../../../models/blog');

const deleteComment = async (req, res) => {
  const currentUserId = req.userId;
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId)
      .select('userId blogId')
      .lean()
      .exec();

    if (!comment) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Comment not found',
      });
    }

    // Only comment owner or admin can delete (req.user comes from authenticate)
    if (comment.userId.toString() !== currentUserId && req.user?.role !== 'admin') {
      logger.warn('Unauthorized comment delete attempt', {
        userId: currentUserId,
        commentId,
      });
      return res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions',
      });
    }

    await Comment.deleteOne({ _id: commentId });

    // Atomic decrement, and never below 0
    await Blog.updateOne(
      { _id: comment.blogId, commentsCount: { $gt: 0 } },
      { $inc: { commentsCount: -1 } },
    );

    logger.info('Comment deleted successfully', {
      commentId,
      blogId: comment.blogId,
    });

    return res.sendStatus(204);

  } catch (err) {
    logger.error('Error while deleting comment', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = deleteComment;