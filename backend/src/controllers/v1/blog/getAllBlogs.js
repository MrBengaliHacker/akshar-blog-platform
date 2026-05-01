// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const Blog = require('../../../models/blog');
const User = require('../../../models/user');

const getAllBlogs = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || config.DEFAULT_RES_LIMIT;
    const offset = parseInt(req.query.offset) || config.DEFAULT_RES_OFFSET;

    // Check user role to filter blogs
    const user = await User.findById(userId)
      .select('role')
      .lean()
      .exec();

    const query = {};

    // Show only published posts to normal users
    if (user?.role === 'user') {
      query.status = 'published';
    }

    const total = await Blog.countDocuments(query);

    const blogs = await Blog.find(query)
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .limit(limit)
      .skip(offset)
      .sort({ publishedAt: -1 })
      .lean()
      .exec();

    logger.info('Fetched all blogs', { total, limit, offset });

    return res.status(200).json({
      total,
      limit,
      offset,
      blogs,
    });
  } catch (err) {
    logger.error('Error while getting all blogs', err);

    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
}

module.exports = getAllBlogs;