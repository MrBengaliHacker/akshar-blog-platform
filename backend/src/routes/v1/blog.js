const router = require('express').Router();

// Middlewares
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

// Controllers
const createBlog = require('../../controllers/v1/blog/createBlog');

router.post(
  '/',
  authenticate,
  authorize(['admin', 'user']),
  createBlog,
);

module.exports = router;