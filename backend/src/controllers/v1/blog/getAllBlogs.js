// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const Blog = require('../../../models/blog');


const getAllBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || config.DEFAULT_RES_LIMIT;
    const offset = parseInt(req.query.offset) || config.DEFAULT_RES_OFFSET;

    const query = { status: 'published' };

    // Admin can also see drafts
    if (req.user?.role === 'admin') {
      delete query.status;
    }

    const total = await Blog.countDocuments(query);

    const blogs = await Blog.find(query)
      .select('-banner.publicId -__v')
      .populate('author', '-password -createdAt -updatedAt -__v')
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
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
}

module.exports = getAllBlogs;