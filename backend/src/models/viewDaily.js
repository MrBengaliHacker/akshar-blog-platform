const mongoose = require('mongoose');

// How many times a blog was read on one day (for the dashboard graphs)
const viewDailySchema = new mongoose.Schema({
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // The day in UTC, for example "2026-10-21"
  day: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
  },
  // MongoDB removes the document automatically at this time (TTL index)
  expiresAt: {
    type: Date,
    required: true,
    expires: 0,
  },
});

// One document for each blog and day
viewDailySchema.index({ blog: 1, day: 1 }, { unique: true });
// For the graphs of one writer
viewDailySchema.index({ author: 1, day: 1 });

module.exports = mongoose.model('ViewDaily', viewDailySchema);