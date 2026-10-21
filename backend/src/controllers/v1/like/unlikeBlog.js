// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const Blog = require('../../../models/blog');
const Like = require('../../../models/like');

const unlikeBlog = async (req, res) => {
  const { blogId } = req.params;
  const userId = req.userId; // ← from token not body

  try {
    const deletedLike = await Like.findOneAndDelete({ userId, blogId });

    if (!deletedLike) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Like not found',
      });
    }

    // Atomic decrement, and never below 0
    await Blog.updateOne(
      { _id: blogId, likesCount: { $gt: 0 } },
      { $inc: { likesCount: -1 } },
    );

    logger.info('Blog unliked successfully', { userId, blogId });

    return res.sendStatus(204);

  } catch (err) {
    logger.error('Error while unliking blog', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = unlikeBlog;