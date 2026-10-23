// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const User = require('../../../models/user');
const Token = require('../../../models/token');

const banUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // An admin cannot ban their own account
    if (userId === req.userId) {
      return res.status(400).json({
        code: 'BadRequest',
        message: 'You cannot ban your own account',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    // Admin accounts cannot be banned
    if (user.role === 'admin') {
      return res.status(400).json({
        code: 'BadRequest',
        message: 'Admin accounts cannot be banned',
      });
    }

    // Toggle ban status
    user.isBanned = !user.isBanned;
    await user.save();

    // A banned user is logged out on all devices
    if (user.isBanned) {
      await Token.deleteMany({ userId });
    }

    logger.info(`User ${user.isBanned ? 'banned' : 'unbanned'} successfully`, {
      userId,
      isBanned: user.isBanned,
      by: req.userId,
    });

    return res.status(200).json({
      message: user.isBanned
        ? 'User banned successfully'
        : 'User unbanned successfully',
      isBanned: user.isBanned,
    });

  } catch (err) {
    logger.error('Error while banning/unbanning user', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = banUser;