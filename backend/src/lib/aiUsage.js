// Custom modules
const config = require('../config');

// Models
const AiUsage = require('../models/aiUsage');

const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

// Returns the current UTC date as YYYY-MM-DD.
const today = () => new Date().toISOString().slice(0, 10);

const getLimit = (role) =>
  role === 'admin' ? config.AI_ADMIN_DAILY_LIMIT : config.AI_DAILY_LIMIT;

// Atomic add (or subtract) on one counter and return the new number
const change = async (key, amount) => {
  const run = () =>
    AiUsage.findOneAndUpdate(
      { key },
      {
        $inc: { count: amount },
        $setOnInsert: { expiresAt: new Date(Date.now() + TWO_DAYS) },
      },
      { upsert: true, new: true },
    )
      .lean()
      .exec();

  try {
    return (await run()).count;
  } catch (err) {
    // Retry if concurrent requests cause a duplicate-key error.
    if (err.code === 11000) return (await run()).count;
    throw err;
  }
};

// Counts one AI use. Returns { allowed, used, limit, remaining, reason }.
// When it is not allowed nothing is counted.
const consumeAiUse = async (userId, role) => {
  const limit = getLimit(role);
  const day = today();
  const userKey = `user:${userId}:${day}`;
  const globalKey = `global:${day}`;

  const used = await change(userKey, 1);

  if (used > limit) {
    await change(userKey, -1);
    return { allowed: false, reason: 'user', used: limit, limit, remaining: 0 };
  }

  const globalUsed = await change(globalKey, 1);

  if (globalUsed > config.AI_GLOBAL_DAILY_LIMIT) {
    await change(globalKey, -1);
    await change(userKey, -1);
    return {
      allowed: false,
      reason: 'global',
      used: used - 1,
      limit,
      remaining: limit - (used - 1),
    };
  }

  return { allowed: true, used, limit, remaining: limit - used };
};

// Gives the use back (for example when Gemini failed)
const refundAiUse = async (userId) => {
  const day = today();

  await change(`user:${userId}:${day}`, -1);
  await change(`global:${day}`, -1);
};

// Reads how many AI uses the user has today
const readAiUsage = async (userId, role) => {
  const limit = getLimit(role);
  const doc = await AiUsage.findOne({ key: `user:${userId}:${today()}` })
    .lean()
    .exec();

  const used = Math.min(doc?.count ?? 0, limit);

  return { used, limit, remaining: limit - used };
};

module.exports = { consumeAiUse, refundAiUse, readAiUsage };