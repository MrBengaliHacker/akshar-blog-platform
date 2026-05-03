// Custom modules
const logger = require('../../../lib/logger');

// Models
const User = require('../../../models/user');

const updateCurrentUser = async (req, res) => {
  const userId = req.userId;
  const {
    username,
    email,
    password,
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

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (avatar) user.avatar = avatar;
    if (bio) user.bio = bio;

    if (!user.socialLinks) user.socialLinks = {};
    if (website) user.socialLinks.website = website;
    if (facebook) user.socialLinks.facebook = facebook;
    if (instagram) user.socialLinks.instagram = instagram;
    if (linkedin) user.socialLinks.linkedin = linkedin;
    if (x) user.socialLinks.x = x;
    if (youtube) user.socialLinks.youtube = youtube;

    await user.save();

    logger.info('User updated successfully', { userId });

    return res.status(200).json({
      user: {
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
      message: 'Internal server error',
    });
  }
};

module.exports = updateCurrentUser;