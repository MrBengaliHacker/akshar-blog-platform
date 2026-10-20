const { v2: cloudinary } = require('cloudinary');

// Custom modules
const logger = require('./logger');
require('./cloudinary'); // makes sure Cloudinary is configured

// Models
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const Like = require('../models/like');
const Token = require('../models/token');
const User = require('../models/user');

// Deletes a user and everything that belongs to the user
const deleteUserData = async (userId) => {
  // 1. Collect what we need before deleting
  const blogs = await Blog.find({ author: userId })
    .select('_id banner.publicId')
    .lean()
    .exec();

  const blogIds = blogs.map((blog) => blog._id);
  const bannerIds = blogs.map((blog) => blog.banner?.publicId).filter(Boolean);

  // 2. The user's blogs with their comments and likes
  await Promise.all([
    Comment.deleteMany({ blogId: { $in: blogIds } }),
    Like.deleteMany({ blogId: { $in: blogIds } }),
  ]);
  await Blog.deleteMany({ author: userId });

  // 3. Likes this user gave on other blogs: fix the counters, then delete them
  const likes = await Like.find({ userId, blogId: { $exists: true } })
    .select('blogId')
    .lean()
    .exec();

  if (likes.length > 0) {
    await Blog.bulkWrite(
      likes.map((like) => ({
        updateOne: {
          filter: { _id: like.blogId, likesCount: { $gt: 0 } },
          update: { $inc: { likesCount: -1 } },
        },
      })),
    );
    await Like.deleteMany({ userId });
  }

  // 4. Sessions and the user
  await Token.deleteMany({ userId });
  await User.deleteOne({ _id: userId });

  // 5. Images. Best effort: the data is already deleted, so a Cloudinary problem must not make the whole request fail.
  try {
    // Cloudinary accepts max 100 ids per call
    for (let i = 0; i < bannerIds.length; i += 100) {
      await cloudinary.api.delete_resources(bannerIds.slice(i, i + 100));
    }

    // The public id includes the "blog-api/" folder
    await cloudinary.uploader.destroy(`blog-api/avatars/${userId}`);
  } catch (err) {
    logger.error('Error while deleting user images from Cloudinary', err);
  }

  logger.info('User data deleted', { userId, blogs: blogIds.length });
};

module.exports = deleteUserData;