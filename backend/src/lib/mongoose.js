const mongoose = require('mongoose');
const config = require('../config');

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
    console.log("Connected to database");
  } catch (err) {
    console.error("Error connecting to database", err);
    throw err;
  }
};

const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from database");
  } catch (err) {
    console.error("Error disconnecting from database", err);
  }
};


module.exports = {connectToDatabase, disconnectFromDatabase};