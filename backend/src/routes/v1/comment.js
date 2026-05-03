const router = require('express').Router();
const { body, param } = require('express-validator');

// Middlewares
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validationError = require('../../middlewares/validationError');

// Controllers
const commentBlog = require('../../controllers/v1/comment/commentBlog');
const getCommentsByBlog = require('../../controllers/v1/comment/getCommentsByBlog');
const deleteComment = require('../../controllers/v1/comment/deleteComment');

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

router.get(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId')
    .isMongoId()
    .withMessage('Invalid blog ID'),
  validationError,
  getCommentsByBlog,
);

router.delete(
  '/:commentId',
  authenticate,
  authorize(['admin', 'user']),
  param('commentId')
    .isMongoId()
    .withMessage('Invalid comment ID'),
  validationError,
  deleteComment,
);


module.exports = router;