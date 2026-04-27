// Custom modules
const logger = require('../lib/logger');

// Models
const User = require('../models/user');

const authorize = (roles) => {
  return async (req, res, next) => {
    const userId = req.userId;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          code: 'NotFound',
          message: 'User not found',
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          code: 'AuthorizationError',
          message: 'Access denied, insufficient permissions',
        });
      }

      return next();
    } catch (err) {
      logger.error('Authorize error', err);

      return res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
      });
    }
  };
};

module.exports = authorize;