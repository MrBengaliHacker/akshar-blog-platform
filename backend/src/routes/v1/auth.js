const router = require('express').Router();
const { body } = require('express-validator');

// Controllers
const register = require('../../controllers/v1/auth/register');

// Middlewares
const validationError = require('../../middlewares/validationError');

// Models
const User = require('../../models/User');

router.post(
  '/register',

  body('email')
  .trim()
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
  register);

module.exports = router;