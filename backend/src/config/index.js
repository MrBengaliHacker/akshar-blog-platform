require('dotenv').config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  WHITELIST_ORIGINS: ['http://localhost:5173'],
  MONGO_URI: process.env.MONGO_URI,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  ADMIN_EMAILS: process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim())
    : [],
};

module.exports = config;