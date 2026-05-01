const { randomBytes } = require('crypto');

exports.genUsername = () => {
  return 'user_' + randomBytes(6).toString('hex');
};

exports.genSlug = (title) => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const randomChars = Math.random().toString(36).slice(2);
  return `${slug}-${randomChars}`;
};