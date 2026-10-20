const bcrypt = require('bcrypt');

// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const User = require('../../../models/user');
const Token = require('../../../models/token');

const updateCurrentUser = async (req, res) => {
  const userId = req.userId;
  const {
    username,
    email,
    password,
    currentPassword,
    firstName,
    lastName,
    avatar,
    bio,
    website,
    facebook,
    instagram,
    linkedin,
    x,
    youtube,
  } = req.body;

  try {
    const user = await User.findById(userId)
    .select('+password -__v')
    .exec();

    if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    // Changing the password needs the current password
    let passwordChanged = false;

    if (password) {
      const isMatch = currentPassword
        ? await bcrypt.compare(currentPassword, user.password)
        : false;

      if (!isMatch) {
        return res.status(400).json({
          code: 'ValidationError',
          errors: {
            currentPassword: {
              type: 'field',
              path: 'currentPassword',
              msg: 'Current password is incorrect',
            },
          },
        });
      }

      user.password = password;
      passwordChanged = true;
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;

    // An empty string is allowed here, so the user can clear these fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;

    if (!user.socialLinks) user.socialLinks = {};
    if (website !== undefined) user.socialLinks.website = website;
    if (facebook !== undefined) user.socialLinks.facebook = facebook;
    if (instagram !== undefined) user.socialLinks.instagram = instagram;
    if (linkedin !== undefined) user.socialLinks.linkedin = linkedin;
    if (x !== undefined) user.socialLinks.x = x;
    if (youtube !== undefined) user.socialLinks.youtube = youtube;

    await user.save();

    // Password changed: log out all other devices, keep this one
    if (passwordChanged) {
      await Token.deleteMany({
        userId,
        token: { $ne: req.cookies.refreshToken },
      });
    }

    logger.info('User updated successfully', { userId });

    return res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        firstName: user.firstName,
        lastName: user.lastName,
        socialLinks: user.socialLinks,
        isBanned: user.isBanned,
        createdAt: user.createdAt,
      },
    });

  } catch (err) {
    logger.error('Error while updating user', err);

    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(409).json({
        code: 'ConflictError',
        message: `${field} already exists`,
      });
    }

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = updateCurrentUser;