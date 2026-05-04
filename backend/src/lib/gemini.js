const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

if (!config.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is missing in environment variables');
}

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

module.exports = model;