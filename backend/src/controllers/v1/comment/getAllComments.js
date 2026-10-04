// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const Comment = require('../../../models/comment');

const getAllComments = async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const total = await Comment.countDocuments();

    const comments = await Comment.find()
      .select('-__v')
      .populate('userId', 'username avatar -__v')
      .populate('blogId', 'title slug -__v')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();

    logger.info('All comments fetched successfully', {
      total,
      limit,
      offset,
    });

    return res.status(200).json({
      total,
      limit,
      offset,
      comments,
    });

  } catch (err) {
    logger.error('Error retrieving all comments', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = getAllComments;