const router = require('express').Router();

// Controllers
const register = require('../../controllers/v1/auth/register');

// Middlewares


// Models


router.post('/register', register);

module.exports = router;