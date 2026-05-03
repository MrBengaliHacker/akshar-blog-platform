const { JSDOM } = require('jsdom');
const DOMPurify = require('dompurify');

// Custom modules
const logger = require('../../../lib/logger');

// Models
const Blog = require('../../../models/blog');
const Comment = require('../../../models/comment');

// Setup DOMPurify
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const commentBlog = async (req, res) => {
  const { content } = req.body;
  const { blogId } = req.params;
  const userId = req.userId;

  try {
    const blog = await Blog.findById(blogId)
      .select('_id commentsCount')
      .exec();

    if (!blog) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
    }

    // Sanitize comment content
    const cleanContent = purify.sanitize(content);

    const newComment = await Comment.create({
      blogId,
      content: cleanContent,
      userId,
    });

    blog.commentsCount++;
    await blog.save();

    logger.info('New comment created', {
      commentId: newComment._id,
      blogId,
      userId,
      commentsCount: blog.commentsCount,
    });

    return res.status(201).json({
      comment: newComment,
    });

  } catch (err) {
    logger.error('Error during blog comment creation', err);

    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

module.exports = commentBlog;