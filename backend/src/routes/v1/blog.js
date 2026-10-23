const router = require('express').Router();
const { body, query, param } = require('express-validator');
const multer = require('multer');

// Middlewares
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validationError = require('../../middlewares/validationError');
const uploadBlogBanner = require('../../middlewares/uploadBlogBanner');
const demoGuard = require('../../middlewares/demoGuard');
const optionalAuthenticate = require('../../middlewares/optionalAuthenticate');

// Controllers
const createBlog = require('../../controllers/v1/blog/createBlog');
const getAllBlogs = require('../../controllers/v1/blog/getAllBlogs');
const getBlogsByUser = require('../../controllers/v1/blog/getBlogsByUser');
const getBlogBySlug = require('../../controllers/v1/blog/getBlogBySlug');
const updateBlog = require('../../controllers/v1/blog/updateBlog');
const deleteBlog = require('../../controllers/v1/blog/deleteBlog');
const incrementViewCount = require('../../middlewares/incrementViewCount');

// Tiptap sends <p></p> for an empty editor, so check the text inside the tags
const hasText = (html) =>
  html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length > 0;

// Multer - store file in memory buffer (max 2MB)
const upload = multer({ limits: { fileSize: 2 * 1024 * 1024 } });

router.post(
  '/',
  authenticate,
  authorize(['admin', 'user']),
  demoGuard,
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
    .withMessage('Content is required')
    .custom(hasText)
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
  optionalAuthenticate,
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
  optionalAuthenticate,
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
  optionalAuthenticate,
  param('slug')
    .notEmpty()
    .withMessage('Slug is required'),
  validationError,
  incrementViewCount,
  getBlogBySlug,
);

router.patch(
  '/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  demoGuard,
  param('blogId')
    .isMongoId()
    .withMessage('Invalid blog ID'),
  upload.single('banner_image'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 characters'),
  body('content')
    .optional()
    .custom(hasText)
    .withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be draft or published'),
  validationError,
  uploadBlogBanner('put'),
  updateBlog,
);

router.delete(
  '/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  demoGuard,
  param('blogId')
    .isMongoId()
    .withMessage('Invalid blog ID'),
  validationError,
  deleteBlog,
);

module.exports = router;