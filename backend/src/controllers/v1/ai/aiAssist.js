const logger = require('../../../lib/logger');
const config = require('../../../config');
const getModel = require('../../../lib/gemini');
const { consumeAiUse, refundAiUse } = require('../../../lib/aiUsage');

const ACTIONS = {
  improve: (text) =>
    `You are a professional blog editor. Improve the writing quality, fix grammar, and enhance clarity of this text while keeping the same meaning and voice:\n\n${text}\n\nReturn only the improved text, no explanations.`,

  continue: (text) =>
    `You are a blog writer. Continue writing this text naturally and engagingly. Match the existing tone and style:\n\n${text}\n\nReturn only the continuation, no explanations.`,

  summarize: (text) =>
    `Summarize this blog content in 2-3 concise sentences:\n\n${text}\n\nReturn only the summary, no explanations.`,

  title: (text) =>
    `Generate 5 catchy, SEO-friendly blog title suggestions for this content. Make them engaging and clickable:\n\n${text}\n\nReturn only the titles as a numbered list.`,

  expand: (text) =>
    `You are a blog writer. Expand this text with more details, examples, and explanations while keeping the same tone:\n\n${text}\n\nReturn only the expanded text, no explanations.`,

  tone_formal: (text) =>
    `Rewrite this text in a formal, professional tone:\n\n${text}\n\nReturn only the rewritten text, no explanations.`,

  tone_casual: (text) =>
    `Rewrite this text in a friendly, casual conversational tone:\n\n${text}\n\nReturn only the rewritten text, no explanations.`,

  fullBlog: (text) =>
    `You are an expert blog writer. Write a complete, well-structured blog post about this topic:\n\n${text}\n\nInclude: engaging introduction, multiple sections with headings, practical examples, and a conclusion. Make it informative and engaging. Return only the blog content in markdown format.`,

  freePrompt: (text) =>
    `You are a helpful AI writing assistant for a blog platform. ${text}`,
};

const aiAssist = async (req, res) => {
  const { prompt, action } = req.body;

  // true after we counted this request, so we can give it back if Gemini fails
  let counted = false;

  try {
    const buildPrompt = ACTIONS[action];

    if (!buildPrompt) {
      return res.status(400).json({
        code: 'ValidationError',
        message: 'Invalid action',
      });
    }

    // AI is optional: without a Gemini key the rest of the app still works
    const model = getModel();

    if (!model) {
      return res.status(503).json({
        code: 'ServiceUnavailable',
        message: 'AI assistant is not available right now',
      });
    }

    // Daily limit per user, and one for all users together (protects our quota)
    const usage = await consumeAiUse(req.userId, req.user.role);

    if (!usage.allowed) {
      return res.status(429).json({
        code: 'TooManyRequests',
        message:
          usage.reason === 'user'
            ? `You used all ${usage.limit} AI requests for today. Please try again tomorrow.`
            : 'The AI assistant is very busy today. Please try again tomorrow.',
        usage: {
          used: usage.used,
          limit: usage.limit,
          remaining: usage.remaining,
        },
      });
    }

    counted = true;

    const fullPrompt = buildPrompt(prompt);
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    logger.info('AI assist completed', {
      action,
      userId: req.userId,
    });

    return res.status(200).json({
      text,
      usage: {
        used: usage.used,
        limit: usage.limit,
        remaining: usage.remaining,
      },
    });

  } catch (err) {
    logger.error('Error during AI assist', err);

    // A failed request must not use up the user's daily limit
    if (counted) {
      await refundAiUse(req.userId).catch((refundErr) =>
        logger.error('Error while refunding AI use', refundErr),
      );
    }

    // Gemini free quota reached
    if (err.status === 429) {
      return res.status(429).json({
        code: 'TooManyRequests',
        message: 'AI is busy right now, please try again in a minute',
      });
    }

    // Gemini refused to answer (safety filter)
    if (/blocked/i.test(err.message)) {
      return res.status(400).json({
        code: 'BadRequest',
        message: 'The AI could not answer this request, try changing your text',
      });
    }

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = aiAssist;