// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const User = require('../../../models/user');
const Blog = require('../../../models/blog');

const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-password -__v -email')
      .lean()
      .exec();

    if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        code: 'AuthorizationError',
        message: 'This account has been banned',
      });
    }

    const blogs = await Blog.find({
      author: userId,
      status: 'published',
    })
      .select('-banner.publicId -__v -content')
      .sort({ publishedAt: -1 })
      .limit(10)
      .lean()
      .exec();

    logger.info('Public profile fetched', { userId });

    return res.status(200).json({
      user,
      blogs,
    });

  } catch (err) {
    logger.error('Error fetching public profile', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = getPublicProfile;