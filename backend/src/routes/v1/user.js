const router = require('express').Router();
const { body, query } = require('express-validator');

// Middlewares
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validationError = require('../../middlewares/validationError');

// Controllers
const getCurrentUser = require('../../controllers/v1/user/getCurrentUser');
const updateCurrentUser = require('../../controllers/v1/user/updateCurrentUser');
const deleteCurrentUser = require('../../controllers/v1/user/deleteCurrentUser');
const getAllUsers = require('../../controllers/v1/user/getAllUsers');

// Models
const User = require('../../models/user');


router.get(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  getCurrentUser,
)

router.patch(
  '/current',
  authenticate,
  authorize(['admin', 'user']),

  body('username')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Username must be less than 20 characters')
    .custom(async (value) => {
      const exists = await User.exists({ username: value });
      if (exists) throw new Error('Username already in use');
    }),

  body('email')
    .optional()
    .trim()
    .normalizeEmail()
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const exists = await User.exists({ email: value });
      if (exists) throw new Error('Email already in use');
    }),

  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('First name must be less than 20 characters'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Last name must be less than 20 characters'),

  body(['website', 'facebook', 'instagram', 'linkedin', 'x', 'youtube'])
    .optional()
    .isURL()
    .withMessage('Invalid URL')
    .isLength({ max: 100 })
    .withMessage('URL must be less than 100 characters'),

  validationError,
  updateCurrentUser,
);

router.delete(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  deleteCurrentUser,
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
  getAllUsers,
);

module.exports = router;