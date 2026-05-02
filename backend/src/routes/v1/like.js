const router = require('express').Router();
const { param } = require('express-validator');

// Middlewares
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validationError = require('../../middlewares/validationError');

// Controllers
const likeBlog = require('../../controllers/v1/like/likeBlog');

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId')
    .isMongoId()
    .withMessage('Invalid blog ID'),
  validationError,
  likeBlog,
);

module.exports = router;