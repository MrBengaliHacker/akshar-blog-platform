const { JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');

// custom modules
const { generateAccessToken, verifyRefreshToken  } = require('../../../lib/jwt');
const logger = require('../../../lib/logger');

// Models
const Token = require('../../../models/token');

const refreshTokenHandler = async (req, res) => {
    try {
      const refreshToken  = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({
          code: 'AuthenticationError',
          message: 'Refresh token missing',
        });
      }

      // check if the refresh token exists in the database
      const tokenExists = await Token.exists({ token: refreshToken });
      if (!tokenExists) {
        return res.status(401).json({
          code: 'AuthenticationError',
          message: 'Invalid refresh token',
        });
      }

      // verify the refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // generate a new access token
      const newAccessToken = generateAccessToken(decoded.id);
      res.status(200).json({ accessToken: newAccessToken });

  } catch (err) {
    logger.error('Refresh token error', err);

    if (err instanceof TokenExpiredError) {
      return res.status(401).json({
        message: 'Refresh token expired, please login again',
      });
    }

    if (err instanceof JsonWebTokenError) {
      return res.status(401).json({
        message: 'Invalid refresh token',
      });
    }

    return res.status(500).json({
      message: 'Server error',
    });
  }
};

module.exports = refreshTokenHandler;