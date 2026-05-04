const { v2: cloudinary } = require('cloudinary');

// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const Blog = require('../../../models/blog');
const User = require('../../../models/user');

const deleteBlog = async (req, res) => {
  try {
    const userId = req.userId;
    const { blogId } = req.params;

    // Check current user role
    const user = await User.findById(userId)
      .select('role')
      .lean()
      .exec();

    const blog = await Blog.findById(blogId)
      .select('author banner.publicId')
      .lean()
      .exec();

    if (!blog) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
    }

    // Only owner or admin can delete
    if (blog.author.toString() !== userId && user?.role !== 'admin') {
      logger.warn('Unauthorized blog delete attempt', { userId, blogId });
      return res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions',
      });
    }

    // Delete banner from Cloudinary
    if (blog.banner?.publicId) {
      await cloudinary.uploader.destroy(blog.banner.publicId);
      logger.info('Blog banner deleted from Cloudinary', {
        publicId: blog.banner.publicId,
      });
    }

    await Blog.deleteOne({ _id: blogId });

    logger.info('Blog deleted successfully', { blogId, userId });

    return res.sendStatus(204);

  } catch (err) {
    logger.error('Error during blog deletion', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = deleteBlog;