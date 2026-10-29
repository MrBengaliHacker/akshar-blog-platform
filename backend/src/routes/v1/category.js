const router = require('express').Router();

// Controllers
const getCategories = require('../../controllers/v1/category/getCategories');

// Public: the list of topics with the number of published blogs
router.get('/', getCategories);

module.exports = router;