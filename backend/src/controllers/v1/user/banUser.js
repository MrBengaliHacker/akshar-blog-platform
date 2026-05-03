// Custom modules
const logger = require('../../../lib/logger');

// Models
const User = require('../../../models/user');

const banUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    // Toggle ban status
    user.isBanned = !user.isBanned;
    await user.save();

    logger.info(`User ${user.isBanned ? 'banned' : 'unbanned'} successfully`, {
      userId,
      isBanned: user.isBanned,
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
      message: 'Internal server error',
    });
  }
};

module.exports = banUser;