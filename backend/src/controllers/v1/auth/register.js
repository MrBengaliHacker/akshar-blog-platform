// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');
const { genUsername } = require('../../../utils');

// Models
const User = require('../../../models/user');

const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    logger.info('Register request received', { email, role });

    // Admin registration check
    let finalRole = 'user';
    if (role === 'admin') {
      if (!config.ADMIN_EMAILS.includes(email)) {
        return res.status(403).json({
          code: 'AuthorizationError',
          message: 'You are not allowed to register as admin',
        });
      }
      finalRole = 'admin';
    }

    const username = genUsername();
    const newUser = await User.create({
      username,
      email,
      password,
      role: finalRole,
    });
    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    logger.error('Error registering user:', err);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err.message,
    });
    logger.error('Error during user registration:', err);
  }
};

module.exports = register;