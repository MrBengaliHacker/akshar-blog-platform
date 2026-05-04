// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const Blog = require('../../../models/blog');
const User = require('../../../models/user');

const getBlogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    const limit = parseInt(req.query.limit) || config.DEFAULT_RES_LIMIT;
    const offset = parseInt(req.query.offset) || config.DEFAULT_RES_OFFSET;

    // Check current user role
    const currentUser = await User.findById(currentUserId)
      .select('role')
      .lean()
      .exec();

    const query = {};

    // Normal users can only see published blogs
    if (currentUser?.role === 'user') {
      query.status = 'published';
    }

    const total = await Blog.countDocuments({
      author: userId,
      ...query,
    });

    const blogs = await Blog.find({
      author: userId,
      ...query,
    })
      .select('-banner.publicId -__v')
      .populate('author', '-password -createdAt -updatedAt -__v')
      .limit(limit)
      .skip(offset)
      .sort({ publishedAt: -1 })
      .lean()
      .exec();

    logger.info('Fetched blogs by user', { userId, total, limit, offset });

    return res.status(200).json({
      total,
      limit,
      offset,
      blogs,
    });

  } catch (err) {
    logger.error('Error while fetching blogs by user', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = getBlogsByUser;