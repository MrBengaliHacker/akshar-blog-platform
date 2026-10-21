require('dotenv').config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  WHITELIST_ORIGINS: process.env.WHITELIST_ORIGINS
    ? process.env.WHITELIST_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:5173'],
  MONGO_URI: process.env.MONGO_URI,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  ADMIN_EMAILS: process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim())
    : [],
  DEMO_ADMIN_EMAIL: process.env.DEMO_ADMIN_EMAIL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  DEFAULT_RES_LIMIT: 20,
  DEFAULT_RES_OFFSET: 0, 
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  AI_DAILY_LIMIT: parseInt(process.env.AI_DAILY_LIMIT) || 3,
  AI_ADMIN_DAILY_LIMIT: parseInt(process.env.AI_ADMIN_DAILY_LIMIT) || 10,
  AI_GLOBAL_DAILY_LIMIT: parseInt(process.env.AI_GLOBAL_DAILY_LIMIT) || 50,
};

const required = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
required.forEach(key => {
  if (!config[key]) throw new Error(`Missing required env variable: ${key}`);
});

module.exports = config;