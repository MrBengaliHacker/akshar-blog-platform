const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

let model = null;

// The model is created only when it is first needed,
// so the server can start without a Gemini key (AI is optional)
const getModel = () => {
  if (!config.GEMINI_API_KEY) return null;

  if (!model) {
    const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  return model;
};

module.exports = getModel;