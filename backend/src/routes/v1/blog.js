const router = require('express').Router();
const { body, query, param } = require('express-validator');
const multer = require('multer');

// Middlewares
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validationError = require('../../middlewares/validationError');
const uploadBlogBanner = require('../../middlewares/uploadBlogBanner');

// Controllers
const createBlog = require('../../controllers/v1/blog/createBlog');
const getAllBlogs = require('../../controllers/v1/blog/getAllBlogs');
const getBlogsByUser = require('../../controllers/v1/blog/getBlogsByUser');
const getBlogBySlug = require('../../controllers/v1/blog/getBlogBySlug');

// Multer - store file in memory buffer
const upload = multer();

router.post(
  '/',
  authenticate,
  authorize(['admin', 'user']),
  upload.single('banner_image'),

  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 characters'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),

  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be draft or published'),

  validationError,
  uploadBlogBanner('post'),
  createBlog,
);

router.get(
  '/',
  authenticate,
  authorize(['admin', 'user']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a positive integer'),
  validationError,
  getAllBlogs,
)

router.get(
  '/user/:userId',
  authenticate,
  authorize(['admin', 'user']),
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a positive integer'),
  validationError,
  getBlogsByUser,
)

router.get(
  '/:slug',
  authenticate,
  authorize(['admin', 'user']),
  param('slug')
    .notEmpty()
    .withMessage('Slug is required'),
  validationError,
  getBlogBySlug,
);

module.exports = router;