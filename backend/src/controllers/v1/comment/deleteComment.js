// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const Comment = require('../../../models/comment');
const User = require('../../../models/user');
const Blog = require('../../../models/blog');

const deleteComment = async (req, res) => {
  const currentUserId = req.userId;
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId)
      .select('userId blogId')
      .exec();

    if (!comment) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Comment not found',
      });
    }

    const user = await User.findById(currentUserId)
      .select('role')
      .exec();

    if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    const blog = await Blog.findById(comment.blogId)
      .select('commentsCount')
      .exec();

    if (!blog) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
    }

    // Only comment owner or admin can delete
    if (comment.userId.toString() !== currentUserId && user.role !== 'admin') {
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

    // Prevent negative comments count
    if (blog.commentsCount > 0) {
      blog.commentsCount--;
    }

    await blog.save();

    logger.info('Comment deleted successfully', {
      commentId,
      blogId: blog._id,
      commentsCount: blog.commentsCount,
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