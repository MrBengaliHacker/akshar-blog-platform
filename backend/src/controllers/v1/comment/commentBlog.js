// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const Blog = require('../../../models/blog');
const Comment = require('../../../models/comment');

const commentBlog = async (req, res) => {
  // Comments are plain text (already trimmed by the route). The frontend shows them as text, 
  // so React escapes them. Never show comments as HTML.
  const { content } = req.body;
  const { blogId } = req.params;
  const userId = req.userId;

  try {
    const blogExists = await Blog.exists({ _id: blogId });

    if (!blogExists) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
    }

    const newComment = await Comment.create({
      blogId,
      content,
      userId,
    });

    // Atomic increment
    await Blog.updateOne({ _id: blogId }, { $inc: { commentsCount: 1 } });

    const commentObject = await Comment.findById(newComment._id)
      .select('-__v')
      .populate('userId', 'username avatar')
      .populate('blogId', 'title slug banner')
      .lean()
      .exec();

    logger.info('New comment created', {
      commentId: newComment._id,
      blogId,
      userId,
    });

    return res.status(201).json({
      comment: commentObject,
    });

  } catch (err) {
    logger.error('Error during blog comment creation', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = commentBlog;