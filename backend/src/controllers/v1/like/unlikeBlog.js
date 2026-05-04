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
    const existingLike = await Like.findOne({ userId, blogId })
      .lean()
      .exec();

    if (!existingLike) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Like not found',
      });
    }

    await Like.deleteOne({ _id: existingLike._id });

    const blog = await Blog.findById(blogId)
      .select('likesCount')
      .exec();

    if (!blog) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
    }

    // Prevent negative likes count
    if (blog.likesCount > 0) {
      blog.likesCount--;
    }

    await blog.save();

    logger.info('Blog unliked successfully', {
      userId,
      blogId: blog._id,
      likesCount: blog.likesCount,
    });

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