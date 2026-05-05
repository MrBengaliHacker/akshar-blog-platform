const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: { 
    type: String, 
    required: true,
    index: true,
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['refresh'],
    default: 'refresh',
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: '7d',
  },
});

module.exports = mongoose.model('Token', tokenSchema);