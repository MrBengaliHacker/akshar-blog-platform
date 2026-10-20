const bcrypt = require('bcrypt');

//  Custom modules
const { generateAccessToken, generateRefreshToken } = require('../../../lib/jwt');
const logger = require('../../../lib/logger')
const config = require('../../../config')
const { refreshCookieOptions } = require('../../../lib/cookies');

// Models
const User = require('../../../models/user');
const Token = require('../../../models/token');

const login = async (req, res) => {
  try {
      const { email, password } = req.body;

      // find user
      const user = await User.findOne({ email }).select('+password').exec();
      if (!user) {
        return res.status(401).json({
          code: 'AuthenticationError',
          message: 'Invalid email or password',
        });
      }

      // password comparison
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          code: 'AuthenticationError',
          message: 'Invalid email or password',
        });
      }

      // banned users cannot log in (checked after the password, so ban status is not leaked)
      if (user.isBanned) {
        return res.status(403).json({
          code: 'AuthorizationError',
          message: 'Your account has been banned',
        });
      }

      // generate access and refresh token for the new user
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
  
      // store the refresh token in the database
      await Token.create({
        userId: user._id,
        token: refreshToken,
        type: 'refresh',
      });
  
      // set the refresh token in an httpOnly cookie
      res.cookie('refreshToken', refreshToken, refreshCookieOptions);
  
      res.status(200).json({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        accessToken,
      });
      logger.info('User logged in successfully', {
        userId: user._id,
        email: user.email,
      });
    } catch (err) {
      logger.error('Error logging in user:', err);
      res.status(500).json({
        code: 'ServerError',
        message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
      });
    }
  };

module.exports = login;