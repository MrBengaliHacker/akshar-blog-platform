const router = require('express').Router();
const { body, param } = require('express-validator');

// Middlewares
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validationError = require('../../middlewares/validationError');

// Controllers
const commentBlog = require('../../controllers/v1/comment/commentBlog');

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId')
    .isMongoId()
    .withMessage('Invalid blog ID'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  validationError,
  commentBlog,
);

module.exports = router;