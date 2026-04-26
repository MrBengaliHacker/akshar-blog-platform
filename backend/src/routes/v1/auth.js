const router = require('express').Router();
const { body, cookie } = require('express-validator');

// Controllers
const register = require('../../controllers/v1/auth/register');
const login = require('../../controllers/v1/auth/login');
const refreshTokenHandler = require('../../controllers/v1/auth/refreshToken');

// Middlewares
const validationError = require('../../middlewares/validationError');

// Models
const User = require('../../models/user');

router.post(
  '/register',

  body('email')
  .trim()
  .normalizeEmail()
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Invalid email format')
  .custom(async (value) => {
      const exists = await User.exists({ email: value });
      if (exists) throw new Error('Email already exists');
      return true;
    }),

  body('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 8 })
    .withMessage('Min 8 characters'),

  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Invalid role'),

  validationError,
  register
);

router.post(
  '/login',

  body('email')
  .trim()
  .normalizeEmail()
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Invalid email format'),

  body('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 8 })
    .withMessage('Min 8 characters'),

  validationError,
  login
);

router.post(
  '/refresh-token',
  cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token required')
    .isJWT()
    .withMessage('Invalid refresh token'),
  refreshTokenHandler
);

module.exports = router;