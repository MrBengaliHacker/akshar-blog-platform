// Custom modules
const { CATEGORIES, DEFAULT_CATEGORY } = require('./categories');

// Models
const Blog = require('../models/blog');
const ViewDaily = require('../models/viewDaily');

const DAY_MS = 24 * 60 * 60 * 1000;

// The daily view numbers are kept for 400 days
const KEEP_DAYS = 400;

const toDay = (date) => date.toISOString().slice(0, 10);

// The days of the chosen range (oldest first) and the start of the range before it
const getRange = (days, now = new Date()) => {
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const from = new Date(today.getTime() - (days - 1) * DAY_MS);
  const prevFrom = new Date(from.getTime() - days * DAY_MS);

  const dates = Array.from({ length: days }, (_, index) =>
    toDay(new Date(from.getTime() + index * DAY_MS)),
  );

  return {
    days,
    from,
    prevFrom,
    dates,
    fromDay: toDay(from),
    prevFromDay: toDay(prevFrom),
  };
};

const buildSeries = (dates, rows) => {
  const byDay = new Map(rows.map((row) => [row._id, row.count]));

  return dates.map((date) => byDay.get(date) ?? 0);
};

// The total of the chosen range and the total of the range before it
const splitTotals = (rows, range) => {
  let current = 0;
  let previous = 0;

  for (const row of rows) {
    if (row._id >= range.fromDay) current += row.count;
    else if (row._id >= range.prevFromDay) previous += row.count;
  }

  return { current, previous };
};

// Counts documents for each day, from a date on
const countByDay = (Model, match, dateField, from) =>
  Model.aggregate([
    { $match: { ...match, [dateField]: { $gte: from } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: `$${dateField}` } },
        count: { $sum: 1 },
      },
    },
  ]);

// The views for each day, from a day on
const viewsByDay = (match, fromDay) =>
  ViewDaily.aggregate([
    { $match: { ...match, day: { $gte: fromDay } } },
    { $group: { _id: '$day', count: { $sum: '$count' } } },
  ]);

// Published blogs and their views for each topic
const topicRows = async (match = {}) => {
  const rows = await Blog.aggregate([
    { $match: { ...match, status: 'published' } },
    {
      $group: {
        _id: { $ifNull: ['$category', DEFAULT_CATEGORY] },
        count: { $sum: 1 },
        views: { $sum: '$viewsCount' },
      },
    },
    { $sort: { count: -1, views: -1 } },
  ]);

  return rows.map(({ _id, count, views }) => ({
    slug: _id,
    name: CATEGORIES.find((category) => category.slug === _id)?.name ?? _id,
    count,
    views,
  }));
};

// Counts one read for today (the numbers behind the "views over time" graph)
const countViewForToday = async (blogId, authorId) => {
  const run = () =>
    ViewDaily.updateOne(
      { blog: blogId, day: toDay(new Date()) },
      {
        $inc: { count: 1 },
        $setOnInsert: {
          author: authorId,
          expiresAt: new Date(Date.now() + KEEP_DAYS * DAY_MS),
        },
      },
      { upsert: true },
    );

  try {
    await run();
  } catch (err) {
    // Two first reads at the same moment: one insert wins, retry the other
    if (err.code === 11000) {
      await run();
      return;
    }

    throw err;
  }
};

module.exports = {
  getRange,
  buildSeries,
  splitTotals,
  countByDay,
  viewsByDay,
  topicRows,
  countViewForToday,
};