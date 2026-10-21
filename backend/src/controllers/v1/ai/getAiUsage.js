// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');
const { readAiUsage } = require('../../../lib/aiUsage');

const getAiUsage = async (req, res) => {
  try {
    const usage = await readAiUsage(req.userId, req.user.role);

    return res.status(200).json({ usage });

  } catch (err) {
    logger.error('Error while reading AI usage', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = getAiUsage;