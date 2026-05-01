const router = require('express').Router();
const { body } = require('express-validator');
const multer = require('multer');

// Middlewares
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validationError = require('../../middlewares/validationError');
const uploadBlogBanner = require('../../middlewares/uploadBlogBanner');

// Controllers
const createBlog = require('../../controllers/v1/blog/createBlog');

// Multer - store file in memory buffer
const upload = multer();

router.post(
  '/',
  authenticate,
  authorize(['admin', 'user']),
  upload.single('banner_image'),
  uploadBlogBanner('post'),

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
  createBlog,
);

module.exports = router;