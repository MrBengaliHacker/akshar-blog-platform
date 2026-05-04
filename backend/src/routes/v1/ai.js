const router = require('express').Router();
const { body } = require('express-validator');

// Middlewares
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validationError = require('../../middlewares/validationError');

// Controllers
const aiAssist = require('../../controllers/v1/ai/aiAssist');

router.post(
  '/assist',
  authenticate,
  authorize(['admin', 'user']),

  body('prompt')
    .trim()
    .notEmpty()
    .withMessage('Prompt is required')
    .isLength({ max: 10000 })
    .withMessage('Prompt must be less than 10000 characters'),

  body('action')
    .trim()
    .notEmpty()
    .withMessage('Action is required')
    .isIn([
      'improve',
      'continue',
      'summarize',
      'title',
      'expand',
      'tone_formal',
      'tone_casual',
      'fullBlog',
      'freePrompt',
    ])
    .withMessage('Invalid action'),

  validationError,
  aiAssist,
);

module.exports = router;