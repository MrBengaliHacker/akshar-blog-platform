// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const Blog = require('../../../models/blog');


const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug })
      .select('-banner.publicId -__v')
      .populate('author', '-password -createdAt -updatedAt -__v')
      .lean()
      .exec();

    if (!blog) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
    }

    // Draft blogs only visible to admin or owner
    if (blog.status === 'draft') {
      if (!req.user) {
        return res.status(403).json({
          code: 'AuthorizationError',
          message: 'Access denied',
        });
      }

      const isAdmin = req.user.role === 'admin';
      const isOwner = blog.author._id.toString() === req.user._id.toString();

      if (!isAdmin && !isOwner) {
        logger.warn('Unauthorized draft blog access attempt', {
          slug,
          userId: req.user._id,
        });

        return res.status(403).json({
          code: 'AuthorizationError',
          message: 'Access denied, insufficient permissions',
        });
      }
    }

    logger.info('Blog fetched by slug', { slug, blogId: blog._id });

    return res.status(200).json({ blog });

  } catch (err) {
    logger.error('Error while fetching blog by slug', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = getBlogBySlug;