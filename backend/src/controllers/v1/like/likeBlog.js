// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const Blog = require('../../../models/blog');
const Like = require('../../../models/like');

const likeBlog = async (req, res) => {
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

    // The unique index (blogId + userId) stops a second like,
    // even when two requests arrive at the same time
    try {
      await Like.create({ blogId, userId });
    } catch (err) {
      if (err.code === 11000) {
        // Already liked (for example from another tab). This is not an error:
        // just return the current count and the user sees the blog as liked.
        const current = await Blog.findById(blogId)
          .select('likesCount')
          .lean()
          .exec();

        return res.status(200).json({
          likesCount: current?.likesCount ?? 0,
        });
      }
      throw err;
    }

    // $inc is atomic: two requests at the same time cannot overwrite each other
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $inc: { likesCount: 1 } },
      { new: true },
    )
      .select('likesCount')
      .lean()
      .exec();

    // The blog was deleted while we were liking it
    if (!blog) {
      await Like.deleteOne({ blogId, userId });

      return res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
    }

    logger.info('Blog liked successfully', {
      userId,
      blogId,
      likesCount: blog.likesCount,
    });

    return res.status(200).json({
      likesCount: blog.likesCount,
    });

  } catch (err) {
    logger.error('Error while liking blog', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = likeBlog;