import { useLoaderData, Link } from 'react-router';
import { motion } from 'motion/react';
import { useEffect } from 'react';

// Custom modules
import { cn } from '@/lib/utils';


// Components
import { BlogCard } from '@/components/BlogCard'
import { Page } from '@/components/Page'
import { Button } from '@/components/ui/button'

// Types
import type { Variants } from 'motion/react';
import type { Blog as BlogType, PaginatedResponse } from '@/types';

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
  const loaderData = useLoaderData() as PaginatedResponse<BlogType, 'blogs'>;

  const { blogs, total, limit, offset } = loaderData;

  const hasPrev = offset > 0;
  const hasNext = offset + limit < total;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const prevOffset = Math.max(0, offset - limit);

  // Start of the page when the user goes to another page
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [offset]);

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
            All blog posts
          </motion.h2>

          <motion.ul
            className='grid lg:grid-cols-2 xl:grid-cols-3 gap-4'
            initial='from'
            whileInView='to'
            viewport={{ once: true }}
            variants={listVariant}
          >
            {blogs.map(
              ({ slug, banner, title, content, author, publishedAt }) => (
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
                    authorName={
                      author.firstName || author.lastName
                        ? `${author.firstName ?? ''} ${author.lastName ?? ''}`.trim()
                        : author.username
                    }
                    publishedAt={publishedAt}
                  />
                </motion.li>
              ),
            )}
          </motion.ul>
          
          {blogs.length === 0 && (
            <p className='text-muted-foreground'>No blogs yet.</p>
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
                  <Link to={prevOffset === 0 ? '/blogs' : `/blogs?offset=${prevOffset}`} viewTransition>
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
                  <Link to={`/blogs?offset=${offset + limit}`} viewTransition>
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