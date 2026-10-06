// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const Like = require('../../../models/like');

const getLikeStatus = async (req, res) => {
  const { blogId } = req.params;
  const userId = req.userId;

  try {
    const existingLike = await Like.exists({ blogId, userId });

    logger.info('Like status checked', {
      userId,
      blogId,
      liked: Boolean(existingLike),
    });

    return res.status(200).json({
      liked: Boolean(existingLike),
    });

  } catch (err) {
    logger.error('Error checking like status', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = getLikeStatus;