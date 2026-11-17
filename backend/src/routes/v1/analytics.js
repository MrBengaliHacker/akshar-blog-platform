const router = require('express').Router();
const { query } = require('express-validator');

// Middlewares
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validationError = require('../../middlewares/validationError');

// Controllers
const getMyAnalytics = require('../../controllers/v1/analytics/getMyAnalytics');
const getAdminAnalytics = require('../../controllers/v1/analytics/getAdminAnalytics');

const daysValidator = query('days')
  .optional()
  .isIn(['7', '30', '90'])
  .withMessage('Days must be 7, 30 or 90');

// The dashboard numbers of the logged in writer
router.get(
  '/me',
  authenticate,
  authorize(['admin', 'user']),
  daysValidator,
  validationError,
  getMyAnalytics,
);

// The dashboard numbers of the whole site
router.get(
  '/admin',
  authenticate,
  authorize(['admin']),
  daysValidator,
  validationError,
  getAdminAnalytics,
);

module.exports = router;