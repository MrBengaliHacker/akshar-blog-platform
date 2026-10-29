// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');
const { DEFAULT_CATEGORY } = require('../../../lib/categories');

// Models
const Blog = require('../../../models/blog');


const getAllBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || config.DEFAULT_RES_LIMIT;
    const offset = parseInt(req.query.offset) || config.DEFAULT_RES_OFFSET;

    const query = { status: 'published' };

    // Admin can also see drafts, only when the frontend asks for them
    if (req.user?.role === 'admin' && req.query.includeDrafts === 'true') {
      delete query.status;
    }

    // Filter by topic
    const { category } = req.query;

    if (category === DEFAULT_CATEGORY) {
      // Old blogs have no topic saved, they count as General
      query.$or = [
        { category: DEFAULT_CATEGORY },
        { category: { $exists: false } },
      ];
    } else if (category) {
      query.category = category;
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