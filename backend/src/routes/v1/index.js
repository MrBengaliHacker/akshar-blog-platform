const express = require('express');
const router = express.Router();

// Routes
const authRoutes = require('./auth');
const userRoutes = require('./user');
const blogRoutes = require('./blog');


router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);

module.exports = router;