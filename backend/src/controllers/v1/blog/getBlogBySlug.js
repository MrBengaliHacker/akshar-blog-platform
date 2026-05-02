// Custom modules
const logger = require('../../../lib/logger');

// Models
const Blog = require('../../../models/blog');
const User = require('../../../models/user');

const getBlogBySlug = async (req, res) => {
  try {
    const userId = req.userId;
    const { slug } = req.params;

    // Check current user role
    const user = await User.findById(userId)
      .select('role')
      .lean()
      .exec();

    const blog = await Blog.findOne({ slug })
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .lean()
      .exec();

    if (!blog) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
    }

    // Block normal users from viewing draft blogs
    if (user?.role === 'user' && blog.status === 'draft') {
      logger.warn('User tried to access a draft blog', { userId, slug });
      return res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions',
      });
    }

    logger.info('Blog fetched by slug', { slug, blogId: blog._id });

    return res.status(200).json({ blog });

  } catch (err) {
    logger.error('Error while fetching blog by slug', err);

    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

module.exports = getBlogBySlug;