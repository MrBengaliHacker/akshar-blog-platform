// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');
const { genUsername } = require('../../../utils');
const { generateAccessToken, generateRefreshToken } = require('../../../lib/jwt');

// Models
const User = require('../../../models/user');
const Token = require('../../../models/token');

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

    // generate access and refresh token for the new user
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // store the refresh token in the database
    await Token.create({
      userId: newUser._id,
      token: refreshToken,
      type: 'refresh',
    });

    // set the refresh token in an httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });
    logger.info('User registered successfully', {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
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