// Custom modules
const logger = require('../../../lib/logger');

// Models
const Blog = require('../../../models/blog');
const Comment = require('../../../models/comment');

const getCommentsByBlog = async (req, res) => {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId)
      .select('_id')
      .exec();

    if (!blog) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
    }

    const comments = await Comment.find({ blogId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    logger.info('Comments fetched successfully', {
      blogId,
      count: comments.length,
    });

    return res.status(200).json({
      total: comments.length,
      comments,
    });

  } catch (err) {
    logger.error('Error retrieving comments', err);

    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

module.exports = getCommentsByBlog;