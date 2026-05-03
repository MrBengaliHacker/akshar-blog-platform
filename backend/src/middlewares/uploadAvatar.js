//  Custom modules
const logger = require('../lib/logger');
const uploadToCloudinary = require('../lib/cloudinary');

// Constants
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const uploadAvatar = async (req, res, next) => {

  // No file provided - skip upload
  if (!req.file) {
    return next();
  }

  if (req.file.size > MAX_FILE_SIZE) {
    return res.status(413).json({
      code: 'ValidationError',
      message: 'Avatar size must be less than 1MB',
    });
  }

  try {
    const data = await uploadToCloudinary(
      req.file.buffer,
      `avatars/${req.userId}`, // unique per user
    );

    if (!data) {
      logger.error('Error while uploading avatar to Cloudinary');
      return res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
      });
    }

    logger.info('Avatar uploaded to Cloudinary', {
      userId: req.userId,
      url: data.secure_url,
    });

    // Attach avatar URL to request body
    req.body.avatar = data.secure_url;

    return next();

  } catch (err) {
    logger.error('Error while uploading avatar to Cloudinary', err);

    const statusCode = err.http_code || 500;

    return res.status(statusCode).json({
      code: statusCode < 500 ? 'ValidationError' : 'ServerError',
      message: err.message || 'Internal server error',
    });
  }
};

module.exports = uploadAvatar;