import { useEffect } from 'react';
import { useLoaderData, useSearchParams, Link } from 'react-router';
import { motion } from 'motion/react';

// Custom modules
import { cn, getUsername } from '@/lib/utils';

// Components
import { BlogCard } from '@/components/BlogCard'
import { Page } from '@/components/Page'
import { Button } from '@/components/ui/button'

// Types
import type { Variants } from 'motion/react';
import type { BlogsLoaderResponse } from '@/routes/loaders/user/blogs';

// Motion variants
const listVariant: Variants = {
  to: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariant: Variants = {
  from: { opacity: 0 },
  to: {
    opacity: 1,
    transition: {
      duration: 1,
      ease: 'backInOut',
    },
  },
};

export const Blogs = ({
  className,
  ...props
}: React.ComponentProps<'section'>) => {
  const loaderData = useLoaderData() as BlogsLoaderResponse;
  const [searchParams] = useSearchParams();

  const { blogs, total, limit, offset, categories } = loaderData;

  // The topic chosen in the address, for example /blogs?category=design
  const activeCategory = searchParams.get('category') ?? '';
  const activeName = categories.find((c) => c.slug === activeCategory)?.name;

  // Topics without published blogs are hidden (except the one that is open)
  const visibleCategories = categories.filter(
    (category) => category.count > 0 || category.slug === activeCategory,
  );
  const allCount = categories.reduce((sum, category) => sum + category.count, 0);

  // Address of another page, it keeps the chosen topic
  const pageUrl = (pageOffset: number) => {
    const params = new URLSearchParams();

    if (activeCategory) params.set('category', activeCategory);
    if (pageOffset > 0) params.set('offset', String(pageOffset));

    const query = params.toString();

    return query ? `/blogs?${query}` : '/blogs';
  };

  const hasPrev = offset > 0;
  const hasNext = offset + limit < total;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Start of the page when the user goes to another page
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [offset, activeCategory]);

  return (
    <Page>
      <section
        className={cn('section', className)}
        {...props}
      >
        <div className='container'>
          <motion.h2
            className='section-title'
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.5,
                ease: 'easeOut',
              },
            }}
          >
            {activeName ?? 'All blog posts'}
          </motion.h2>

          {/* Filter by topic */}
          <nav
            aria-label='Topics'
            className='mb-6 flex flex-wrap gap-2 md:mb-8'
          >
            {[
              { slug: '', name: 'All', count: allCount },
              ...visibleCategories,
            ].map(({ slug, name, count }) => {
              const isActive = slug === activeCategory;

              return (
                <Link
                  key={slug || 'all'}
                  to={slug ? `/blogs?category=${slug}` : '/blogs'}
                  viewTransition
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'rounded-full border px-4 py-1.5 text-sm transition-colors',
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  )}
                >
                  {name}
                  <span className='ms-1.5 opacity-70'>{count}</span>
                </Link>
              );
            })}
          </nav>

          <motion.ul
            className='grid lg:grid-cols-2 xl:grid-cols-3 gap-4'
            initial='from'
            whileInView='to'
            viewport={{ once: true }}
            variants={listVariant}
          >
            {blogs.map(
              ({ slug, banner, title, content, author, category, publishedAt }) => (
                <motion.li
                  key={slug}
                  variants={itemVariant}
                >
                  <BlogCard
                    bannerUrl={banner.url}
                    bannerWidth={banner.width}
                    bannerHeight={banner.height}
                    title={title}
                    content={content}
                    slug={slug}
                    authorId={author?._id}
                    category={category}
                    authorName={author ? getUsername(author) : 'Deleted User'}
                    publishedAt={publishedAt}
                  />
                </motion.li>
              ),
            )}
          </motion.ul>

          {blogs.length === 0 && (
            <p className='text-muted-foreground'>
              {activeName ? 'No blogs in this topic yet.' : 'No blogs yet.'}
            </p>
          )}

          {totalPages > 1 && (
            <motion.nav
              aria-label='Pagination'
              className='mt-8 flex items-center justify-center gap-4 md:mt-10'
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.5,
                  ease: 'backInOut',
                },
              }}
            >
              {hasPrev ? (
                <Button variant='outline' asChild>
                  <Link to={pageUrl(Math.max(0, offset - limit))} viewTransition>
                    Previous
                  </Link>
                </Button>
              ) : (
                <Button variant='outline' disabled>
                  Previous
                </Button>
              )}

              <span className='text-sm text-muted-foreground'>
                Page {currentPage} of {totalPages}
              </span>

              {hasNext ? (
                <Button asChild>
                  <Link to={pageUrl(offset + limit)} viewTransition>
                    Next
                  </Link>
                </Button>
              ) : (
                <Button disabled>Next</Button>
              )}
            </motion.nav>
          )}
        </div>
      </section>
    </Page>
  );
};