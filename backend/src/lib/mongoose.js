const mongoose = require('mongoose');
const config = require('../config');
const logger = require('./logger');

const clientOptions = {
  dbName: 'blog-db',
  appName: 'Blog API',
};

const connectToDatabase = async () => {
  if (!config.MONGO_URI) {
    throw new Error("MongoDB URI is not defined");
  }
  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    logger.info("Connected to database");
  } catch (err) {
    logger.error("Error connecting to database", err);
    throw err;
  }
};

const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
    logger.info("Disconnected from database");
  } catch (err) {
    logger.error("Error disconnecting from database", err);
  }
};


module.exports = {connectToDatabase, disconnectFromDatabase};