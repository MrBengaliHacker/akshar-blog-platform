exports.genUsername = () => {
  const usernamePrefix = 'user_';
  const randomChars = Math.random().toString(36).substring(2);
  return usernamePrefix + randomChars;
};