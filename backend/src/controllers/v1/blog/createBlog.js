const { JSDOM } = require('jsdom');
const DOMPurify = require('dompurify');

// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const Blog = require('../../../models/blog');

// Setup DOMPurify with JSDOM
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const createBlog = async (req, res) => {
  try {
    const { title, content, banner, status } = req.body;
    const userId = req.userId;

    // Sanitize HTML content from Tiptap
    const cleanContent = purify.sanitize(content);

    const newBlog = await Blog.create({
      title,
      content: cleanContent,
      banner,
      status,
      author: userId,
    });

    const blogObject = newBlog.toObject();
    delete blogObject.__v;

    logger.info('New blog created', { blogId: newBlog._id, userId });

    return res.status(201).json({
      blog: blogObject,
    });

  } catch (err) {
    logger.error('Error during blog creation', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = createBlog;