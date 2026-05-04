// Custom modules
const logger = require('../lib/logger');
const config = require('../config');

// Models
const User = require('../models/user');

const demoGuard = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('email');

    if (user?.email === config.DEMO_ADMIN_EMAIL) {
      logger.warn('Demo admin tried to perform restricted action', {
        userId: req.userId,
        path: req.path,
      });

      return res.status(403).json({
        code: 'DemoRestriction',
        message: 'This action is disabled in demo mode',
      });
    }

    return next();

  } catch (err) {
    logger.error('Error in demoGuard middleware', err);

    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

module.exports = demoGuard;