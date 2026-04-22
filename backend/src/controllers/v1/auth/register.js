const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const User = require('../../../models/user');

const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(email, password, role);
    const user = await User.create(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      data: user,
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