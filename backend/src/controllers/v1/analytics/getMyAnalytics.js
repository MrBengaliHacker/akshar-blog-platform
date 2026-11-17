const mongoose = require('mongoose');

// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');
const {
  getRange,
  buildSeries,
  splitTotals,
  countByDay,
  viewsByDay,
  topicRows,
} = require('../../../lib/analytics');

// Models
const Blog = require('../../../models/blog');
const Comment = require('../../../models/comment');
const Like = require('../../../models/like');
const ViewDaily = require('../../../models/viewDaily');

// The numbers and graphs for the dashboard of the logged in writer
const getMyAnalytics = async (req, res) => {
  try {
    const range = getRange(parseInt(req.query.days) || 30);

    // aggregate() does not turn a text id into an ObjectId, so we do it here
    const userId = new mongoose.Types.ObjectId(req.userId);

    const blogs = await Blog.find({ author: userId }).select('_id').lean();
    const blogIds = blogs.map((blog) => blog._id);

    const [
      totalRows,
      viewsRows,
      likesRows,
      commentsRows,
      articleRows,
      topics,
      topArticles,
      recentComments,
      firstView,
    ] = await Promise.all([
      Blog.aggregate([
        { $match: { author: userId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            views: { $sum: '$viewsCount' },
            likes: { $sum: '$likesCount' },
            comments: { $sum: '$commentsCount' },
          },
        },
      ]),
      viewsByDay({ author: userId }, range.prevFromDay),
      countByDay(Like, { blogId: { $in: blogIds } }, 'createdAt', range.prevFrom),
      countByDay(Comment, { blogId: { $in: blogIds } }, 'createdAt', range.prevFrom),
      countByDay(
        Blog,
        { author: userId, status: 'published' },
        'publishedAt',
        range.prevFrom,
      ),
      topicRows({ author: userId }),
      Blog.find({ author: userId, status: 'published' })
        .select('slug title viewsCount likesCount commentsCount banner.url category')
        .sort({ viewsCount: -1, likesCount: -1 })
        .limit(5)
        .lean(),
      Comment.find({ blogId: { $in: blogIds } })
        .select('content createdAt userId blogId')
        .populate('userId', 'username firstName lastName avatar')
        .populate('blogId', 'title slug')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      ViewDaily.findOne({ author: userId }).sort({ day: 1 }).select('day').lean(),
    ]);

    const published = totalRows.find((row) => row._id === 'published');
    const drafts = totalRows.find((row) => row._id === 'draft');

    return res.status(200).json({
      days: range.days,
      // Views are counted by day only since this day
      viewsSince: firstView?.day ?? null,
      totals: {
        articles: published?.count ?? 0,
        drafts: drafts?.count ?? 0,
        views: published?.views ?? 0,
        likes: published?.likes ?? 0,
        comments: published?.comments ?? 0,
      },
      periods: {
        views: splitTotals(viewsRows, range),
        likes: splitTotals(likesRows, range),
        comments: splitTotals(commentsRows, range),
        articles: splitTotals(articleRows, range),
      },
      series: {
        dates: range.dates,
        views: buildSeries(range.dates, viewsRows),
        likes: buildSeries(range.dates, likesRows),
        comments: buildSeries(range.dates, commentsRows),
        articles: buildSeries(range.dates, articleRows),
      },
      topics,
      topArticles,
      recentComments,
    });

  } catch (err) {
    logger.error('Error while getting analytics', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = getMyAnalytics;