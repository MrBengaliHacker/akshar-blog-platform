const mongoose = require('mongoose');

// One document per user per day (key: "user:<id>:YYYY-MM-DD")
// One document per day for global usage (key: "global:YYYY-MM-DD")
const aiUsageSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
  },
  // Automatically delete the document after expiresAt using MongoDB's TTL index.
  expiresAt: {
    type: Date,
    required: true,
    expires: 0,
  },
});

module.exports = mongoose.model('AiUsage', aiUsageSchema);