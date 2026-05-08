const { JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');

// custom modules
const { verifyAccessToken } = require('../lib/jwt');
const logger = require('../lib/logger');

// Models
const User = require('../models/user');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 'AuthenticationError',
      message: 'Access denied, no token provided',
    });
  }

  // Split out the token from the 'Bearer ' prefix
  const [, token] = authHeader.split(' ');

  try {
    // Verify the token and extract the user ID
    const decoded = verifyAccessToken(token);

    // Check if user is banned
    const user = await User.findById(decoded.id).select('email role isBanned');
    if (user?.isBanned) {
      return res.status(403).json({
        code: 'AuthorizationError',
        message: 'Your account has been banned',
      });
    }

    req.user = user;
    req.userId = decoded.id;
    return next();
    
  } catch (err) {
    // Handle expired token errors
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token expired, request a new one with refresh token',
      });
    }

    // Handle invalid token errors
    if (err instanceof JsonWebTokenError) {
      return res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token invalid',
      });
    }

    // Log unexpected errors and return a generic server error response
    logger.error('Error during authentication', err);
    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

module.exports = authenticate;
