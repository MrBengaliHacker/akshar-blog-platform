const router = require('express').Router();

// Controllers
const getStats = require('../../controllers/v1/stats/getStats');

// Public: articles, writers and reads
router.get('/', getStats);

module.exports = router;