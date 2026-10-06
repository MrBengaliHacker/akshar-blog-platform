const router = require('express').Router();
const { param } = require('express-validator');

// Middlewares
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validationError = require('../../middlewares/validationError');

// Controllers
const likeBlog = require('../../controllers/v1/like/likeBlog');
const unlikeBlog = require('../../controllers/v1/like/unlikeBlog');
const getLikeStatus = require('../../controllers/v1/like/getLikeStatus');

router.get(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId')
    .isMongoId()
    .withMessage('Invalid blog ID'),
  validationError,
  getLikeStatus,
);

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

router.delete(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId')
    .isMongoId()
    .withMessage('Invalid blog ID'),
  validationError,
  unlikeBlog,
);

module.exports = router;