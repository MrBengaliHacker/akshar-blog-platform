// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const Blog = require('../../../models/blog');

// Public list of the writers with the most published blogs
const getWriters = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;

    const writers = await Blog.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: '$author',
          blogsCount: { $sum: 1 },
          viewsCount: { $sum: '$viewsCount' },
        },
      },
      { $sort: { blogsCount: -1, viewsCount: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      // Banned writers are not shown
      { $match: { 'user.isBanned': { $ne: true } } },
      { $limit: limit },
      {
        // Only public fields. No email.
        $project: {
          _id: '$user._id',
          username: '$user.username',
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          avatar: '$user.avatar',
          bio: '$user.bio',
          blogsCount: 1,
          viewsCount: 1,
        },
      },
    ]);

    return res.status(200).json({ writers });

  } catch (err) {
    logger.error('Error while getting writers', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = getWriters;