// Custom modules
const logger = require('../../../lib/logger');

// Models
const User = require('../../../models/user');
const Token = require('../../../models/token');

const deleteCurrentUser = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    // Delete user's refresh tokens from DB
    await Token.deleteMany({ userId });

    // Delete user from DB
    await User.deleteOne({ _id: userId });

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    logger.info('User account deleted successfully', { userId });

    return res.sendStatus(204);

  } catch (err) {
    logger.error('Error while deleting current user account', err);

    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

module.exports = deleteCurrentUser;