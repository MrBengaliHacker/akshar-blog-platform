// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const User = require('../../../models/user');

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-password -__v')
      .lean()
      .exec();

     if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
      });
    }

    logger.info('User fetched successfully', { userId });

    return res.status(200).json({ user });

  } catch (err) {
    logger.error('Error while getting a user', err);

    return res.status(500).json({
      code: 'ServerError',
       message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = getUser;