//  Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');
const { clearCookieOptions } = require('../../../lib/cookies');

// Models
const Token = require('../../../models/token');

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await Token.deleteOne({ token: refreshToken });
      logger.info('User refresh token deleted successfully', {
        userId: req.userId,
        token: refreshToken,
      });
    }

    res.clearCookie('refreshToken', clearCookieOptions);

    res.sendStatus(204);

    logger.info('User logged out successfully', {
      userId: req.userId,
    });
    
  } catch (err) {
    logger.error('Error during logout', err);
    res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = logout;