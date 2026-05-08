// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');

// Models
const User = require('../../../models/user');

const getAllUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || config.DEFAULT_RES_LIMIT;
    const offset = parseInt(req.query.offset) || config.DEFAULT_RES_OFFSET;

    const total = await User.countDocuments();

    let users = await User.find()
      .select('-password -__v')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    console.log('REQ USER:', req.user);
    console.log('DEMO EMAIL:', config.DEMO_ADMIN_EMAIL);
    
    // Hide real admin emails from demo admin
    if (
      req.user?.email?.toLowerCase() ===
      config.DEMO_ADMIN_EMAIL
    ) {
      users = users.map(user => {

        // Hide real admin email
        if (
          user.role === 'admin' &&
          user.email?.toLowerCase() !== config.DEMO_ADMIN_EMAIL
        ) {
          return {
            ...user,
            email: 'hidden',
          };
        }

        return user;
      });
    }

    logger.info('Fetched all users', { total, limit, offset });

    return res.status(200).json({
      total,
      limit,
      offset,
      data: users,
    });

  } catch (err) {
    logger.error('Error while fetching all users', err);

    return res.status(500).json({ 
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = getAllUsers;