const router = require('express').Router();
const { body, param, query } = require('express-validator');

// Middlewares
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validationError = require('../../middlewares/validationError');

// Controllers
const commentBlog = require('../../controllers/v1/comment/commentBlog');
const getCommentsByBlog = require('../../controllers/v1/comment/getCommentsByBlog');
const deleteComment = require('../../controllers/v1/comment/deleteComment');
const getAllComments = require('../../controllers/v1/comment/getAllComments');

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
  param('blogId')
    .isMongoId()
    .withMessage('Invalid blog ID'),
  validationError,
  getCommentsByBlog,
);

router.get(
  '/',
  authenticate,
  authorize(['admin']),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be an integer between 1 and 50'),

  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a positive integer'),

  validationError,
  getAllComments,
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