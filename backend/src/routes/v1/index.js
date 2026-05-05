const express = require('express');
const router = express.Router();

// Routes
const authRoutes = require('./auth');
const userRoutes = require('./user');
const blogRoutes = require('./blog');
const likeRoutes = require('./like');
const commentRoutes = require('./comment');
const aiRoutes = require('./ai');


router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Akshar Blog API is live',
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    docs: '/api/v1/docs',
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/likes', likeRoutes);
router.use('/comments', commentRoutes);
router.use('/ai', aiRoutes);

module.exports = router;