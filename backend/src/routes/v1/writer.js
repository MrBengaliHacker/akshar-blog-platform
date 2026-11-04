const router = require('express').Router();
const { query } = require('express-validator');

// Middlewares
const validationError = require('../../middlewares/validationError');

// Controllers
const getWriters = require('../../controllers/v1/writer/getWriters');

// Public: the top writers
router.get(
  '/',
  query('limit')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Limit must be an integer between 1 and 12'),
  validationError,
  getWriters,
);

module.exports = router;