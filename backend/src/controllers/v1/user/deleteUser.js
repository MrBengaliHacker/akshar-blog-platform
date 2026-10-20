// Custom modules
const logger = require('../../../lib/logger');
const config = require('../../../config');
const deleteUserData = require('../../../lib/deleteUserData');

// Models
const User = require('../../../models/user');

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    // Delete the user with blogs, comments, likes, images and sessions
    await deleteUserData(userId);

    logger.info('User deleted by admin', { 
      deletedUser: user.email,
      deletedBy: req.userId,
    });

    return res.sendStatus(204);

  } catch (err) {
    logger.error('Error while deleting user account', err);

    return res.status(500).json({
      code: 'ServerError',
      message: config.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    });
  }
};

module.exports = deleteUser;