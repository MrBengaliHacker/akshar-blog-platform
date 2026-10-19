const { TokenExpiredError } = require('jsonwebtoken');

// Custom modules
const { verifyAccessToken } = require('../lib/jwt');

// Models
const User = require('../models/user');

// Works for guests and logged in users. Never blocks a guest.
const optionalAuthenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('email role isBanned');

    if (user && !user.isBanned) {
      req.user = user;
      req.userId = decoded.id;
    }
  } catch (err) {
    // Expired token: tell the frontend to refresh it
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token expired, request a new one with refresh token',
      });
    }
    // Any other bad token: continue as a guest
  }

  return next();
};

module.exports = optionalAuthenticate;