// The topics a blog can have. To add a topic, add one line here.
const CATEGORIES = [
  { slug: 'technology', name: 'Technology' },
  { slug: 'development', name: 'Development' },
  { slug: 'design', name: 'Design' },
  { slug: 'ai-ml', name: 'AI & ML' },
  { slug: 'science', name: 'Science' },
  { slug: 'history', name: 'History' },
  { slug: 'psychology', name: 'Psychology' },
  { slug: 'philosophy', name: 'Philosophy' },
  { slug: 'habits', name: 'Habits & Productivity' },
  { slug: 'self-improvement', name: 'Self-Improvement' },
  { slug: 'career', name: 'Career' },
  { slug: 'startup', name: 'Startup' },
  { slug: 'finance', name: 'Finance' },
  { slug: 'lifestyle', name: 'Lifestyle' },
  { slug: 'travel-culture', name: 'Travel & Culture' },
  { slug: 'general', name: 'General' },
];

const CATEGORY_SLUGS = CATEGORIES.map((category) => category.slug);

// Used when no topic is chosen, and for old blogs that have no topic saved
const DEFAULT_CATEGORY = 'general';

module.exports = { CATEGORIES, CATEGORY_SLUGS, DEFAULT_CATEGORY };