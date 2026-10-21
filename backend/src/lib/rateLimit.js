const rateLimit = require('express-rate-limit');

// General limit for all routes
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 60, // 60 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 'TooManyRequests',
    message: 'Too many requests, please try again later.',
  },
});

// Stricter limit for the AI assistant (protects the Gemini free quota)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 10, // 10 AI requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 'TooManyRequests',
    message: 'AI limit reached, please wait a minute and try again.',
  },
});

module.exports = limiter;
module.exports.aiLimiter = aiLimiter;