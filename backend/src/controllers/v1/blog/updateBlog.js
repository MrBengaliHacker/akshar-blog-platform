const { JSDOM } = require('jsdom');
const DOMPurify = require('dompurify');

// Custom modules
const logger = require('../../../lib/logger');

// Models
const Blog = require('../../../models/blog');
const User = require('../../../models/user');

// Setup DOMPurify
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const updateBlog = async (req, res) => {
  try {
    const { title, content, banner, status } = req.body;
    const userId = req.userId;
    const { blogId } = req.params;

    // Check current user role
    const user = await User.findById(userId)
      .select('role')
      .lean()
      .exec();

    const blog = await Blog.findById(blogId).exec();

    if (!blog) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
    }

    // Only owner or admin can update
    if (blog.author.toString() !== userId && user?.role !== 'admin') {
      logger.warn('Unauthorized blog update attempt', { userId, blogId });
      return res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions',
      });
    }

    if (title) blog.title = title;
    if (content) {
      // Sanitize HTML content from Tiptap
      blog.content = purify.sanitize(content);
    }
    if (banner) blog.banner = banner;
    if (status) blog.status = status;

    await blog.save();

    logger.info('Blog updated successfully', { blogId, userId });

    return res.status(200).json({ blog });

  } catch (err) {
    logger.error('Error while updating blog', err);

    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

module.exports = updateBlog;