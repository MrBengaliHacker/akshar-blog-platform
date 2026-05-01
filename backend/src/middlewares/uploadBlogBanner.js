// Custom modules
const logger = require('../lib/logger');
const uploadToCloudinary = require('../lib/cloudinary');

// Constants
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const uploadBlogBanner = (method) => {
  return async (req, res, next) => {

    // If updating and no new file provided, skip upload
    if (method === 'put' && !req.file) {
      return next();
    }

    if (!req.file) {
      return res.status(400).json({
        code: 'ValidationError',
        message: 'Blog banner is required',
      });
    }

    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(413).json({
        code: 'ValidationError',
        message: 'File size must be less than 2MB',
      });
    }

    try {
      const data = await uploadToCloudinary(req.file.buffer);

      if (!data) {
        logger.error('Error while uploading blog banner to Cloudinary');
        return res.status(500).json({
          code: 'ServerError',
          message: 'Internal server error',
        });
      }

      const newBanner = {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.height,
      };

      logger.info('Blog banner uploaded to Cloudinary', { banner: newBanner });

      // Attach banner data to request body for controller
      req.body.banner = newBanner;

      return next();

    } catch (err) {
        logger.error('Error while uploading blog banner to Cloudinary', err);

        const statusCode = err.http_code || 500;

        return res.status(statusCode).json({
          code: statusCode < 500 ? 'ValidationError' : 'ServerError',
          message: err.message || 'Internal server error',
        });
      }
  };
};

module.exports = uploadBlogBanner;