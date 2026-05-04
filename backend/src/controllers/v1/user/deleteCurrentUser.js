const { v2: cloudinary } = require('cloudinary');

// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const User = require('../../../models/user');
const Token = require('../../../models/token');
const Blog = require('../../../models/blog');

const deleteCurrentUser = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    // Delete avatar from Cloudinary if exists
    if (user.avatar) {
      await cloudinary.uploader.destroy(`avatars/${userId}`);
      logger.info('Avatar deleted from Cloudinary', { userId });
    }

    // Find all user's blogs with banner publicIds
    const blogs = await Blog.find({ author: userId })
      .select('banner.publicId')
      .lean()
      .exec();

    // Delete all blog banners from Cloudinary
    const publicIds = blogs
      .map((b) => b.banner?.publicId)
      .filter(Boolean);

    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
      logger.info('Multiple blog banners deleted from Cloudinary', {
        publicIds,
      });
    }

    // Delete all user's blogs
    await Blog.deleteMany({ author: userId });
    logger.info('Multiple blogs deleted', { userId });
    
    // Delete user's refresh tokens from DB
    await Token.deleteMany({ userId });

    // Delete user from DB
    await User.deleteOne({ _id: userId });

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    logger.info('User account deleted successfully', { userId });

    return res.sendStatus(204);

  } catch (err) {
    logger.error('Error while deleting current user account', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = deleteCurrentUser;