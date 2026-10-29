// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');
const { CATEGORIES, DEFAULT_CATEGORY } = require('../../../lib/categories');

// Models
const Blog = require('../../../models/blog');

const getCategories = async (req, res) => {
  try {
    // How many published blogs each topic has
    // (old blogs without a topic are counted as General)
    const counts = await Blog.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: { $ifNull: ['$category', DEFAULT_CATEGORY] },
          count: { $sum: 1 },
        },
      },
    ]);

    const countBySlug = Object.fromEntries(
      counts.map(({ _id, count }) => [_id, count]),
    );

    const categories = CATEGORIES.map(({ slug, name }) => ({
      slug,
      name,
      count: countBySlug[slug] ?? 0,
    }));

    return res.status(200).json({ categories });

  } catch (err) {
    logger.error('Error while getting categories', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = getCategories;