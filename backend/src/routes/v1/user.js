const router = require('express').Router();

// Middlewares
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

// Controllers
const getCurrentUser = require('../../controllers/v1/user/getCurrentUser');


router.get(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  getCurrentUser,

)

module.exports = router;