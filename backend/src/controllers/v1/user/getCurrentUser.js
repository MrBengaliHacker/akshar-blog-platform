// Custom modules
const logger = require('../../../lib/logger');

// Models
const User = require('../../../models/user');

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId)
      .select('-password -__v')
      .lean()
      .exec();

    if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    return res.status(200).json({ user });

  } catch (err) {
    logger.error('Get current user error', err);

    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

module.exports = getCurrentUser;