// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const Blog = require('../../../models/blog');

// Public numbers for the home page, counted from the published blogs
const getStats = async (req, res) => {
  try {
    const [result] = await Blog.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: null,
          articles: { $sum: 1 },
          reads: { $sum: '$viewsCount' },
          authors: { $addToSet: '$author' },
        },
      },
      {
        $project: {
          _id: 0,
          articles: 1,
          reads: 1,
          writers: { $size: '$authors' },
        },
      },
    ]);

    return res.status(200).json({
      articles: result?.articles ?? 0,
      writers: result?.writers ?? 0,
      reads: result?.reads ?? 0,
    });

  } catch (err) {
    logger.error('Error while getting stats', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = getStats;