// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');
const deleteUserData = require('../../../lib/deleteUserData');
const { clearCookieOptions } = require('../../../lib/cookies');

// Models
const User = require('../../../models/user');

const deleteCurrentUser = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select('_id');

    if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    // Delete the user with blogs, comments, likes, images and sessions
    await deleteUserData(userId);

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', clearCookieOptions);

    logger.info('User account deleted successfully', { userId });

    return res.sendStatus(204);

  } catch (err) {
    logger.error('Error while deleting current user account', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = deleteCurrentUser;