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
const User = require('../../../models/user');
const ViewDaily = require('../../../models/viewDaily');

// The numbers and graphs of the whole site, for the admin dashboard
const getAdminAnalytics = async (req, res) => {
  try {
    const range = getRange(parseInt(req.query.days) || 30);

    const [
      users,
      bannedUsers,
      totalRows,
      signupRows,
      articleRows,
      commentsRows,
      likesRows,
      viewsRows,
      topics,
      topWriters,
      topArticles,
      firstView,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBanned: true }),
      Blog.aggregate([
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
      countByDay(User, {}, 'createdAt', range.prevFrom),
      countByDay(Blog, { status: 'published' }, 'publishedAt', range.prevFrom),
      countByDay(Comment, {}, 'createdAt', range.prevFrom),
      countByDay(Like, { blogId: { $exists: true } }, 'createdAt', range.prevFrom),
      viewsByDay({}, range.prevFromDay),
      topicRows(),
      Blog.aggregate([
        { $match: { status: 'published' } },
        {
          $group: {
            _id: '$author',
            blogsCount: { $sum: 1 },
            viewsCount: { $sum: '$viewsCount' },
          },
        },
        { $sort: { viewsCount: -1, blogsCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: '$user._id',
            username: '$user.username',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            avatar: '$user.avatar',
            blogsCount: 1,
            viewsCount: 1,
          },
        },
      ]),
      Blog.find({ status: 'published' })
        .select('slug title viewsCount likesCount commentsCount banner.url category author')
        .populate('author', 'username firstName lastName avatar')
        .sort({ viewsCount: -1, likesCount: -1 })
        .limit(5)
        .lean(),
      ViewDaily.findOne().sort({ day: 1 }).select('day').lean(),
    ]);

    const published = totalRows.find((row) => row._id === 'published');
    const drafts = totalRows.find((row) => row._id === 'draft');

    return res.status(200).json({
      days: range.days,
      viewsSince: firstView?.day ?? null,
      totals: {
        users,
        bannedUsers,
        articles: published?.count ?? 0,
        drafts: drafts?.count ?? 0,
        views: published?.views ?? 0,
        likes: published?.likes ?? 0,
        comments: published?.comments ?? 0,
      },
      periods: {
        users: splitTotals(signupRows, range),
        articles: splitTotals(articleRows, range),
        comments: splitTotals(commentsRows, range),
        likes: splitTotals(likesRows, range),
        views: splitTotals(viewsRows, range),
      },
      series: {
        dates: range.dates,
        users: buildSeries(range.dates, signupRows),
        articles: buildSeries(range.dates, articleRows),
        comments: buildSeries(range.dates, commentsRows),
        likes: buildSeries(range.dates, likesRows),
        views: buildSeries(range.dates, viewsRows),
      },
      topics,
      topWriters,
      topArticles,
    });

  } catch (err) {
    logger.error('Error while getting admin analytics', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = getAdminAnalytics;