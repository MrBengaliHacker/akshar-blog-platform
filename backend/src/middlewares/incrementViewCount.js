// Custom modules
const logger = require('../lib/logger');
const Blog = require('../models/blog');

const VIEW_COOKIE_TTL = 24 * 60 * 60 * 1000;

const incrementViewCount = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Read existing viewed slugs from cookie
    let viewedSlugs = [];
    try {
      viewedSlugs = JSON.parse(req.cookies.viewed_blogs || '[]');
      if (!Array.isArray(viewedSlugs)) viewedSlugs = [];
    } catch {
      viewedSlugs = [];
    }

    if (!viewedSlugs.includes(slug)) {
      // Not viewed yet — increment and record
      await Blog.updateOne({ slug }, { $inc: { viewsCount: 1 } });

      viewedSlugs.push(slug);

      res.cookie('viewed_blogs', JSON.stringify(viewedSlugs), {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: VIEW_COOKIE_TTL,
      });

      logger.info('View count incremented', { slug, userId: req.userId });
    }

  } catch (err) {
    // Non-fatal: never block the actual blog response
    logger.error('Error incrementing view count', err);
  }

  return next();
};

module.exports = incrementViewCount;