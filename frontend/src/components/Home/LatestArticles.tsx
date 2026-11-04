import { Link, useLoaderData } from 'react-router';
import { motion } from 'motion/react';

// Custom modules
import { cn } from '@/lib/utils';
import { fadeUp, revealOnScroll, stagger } from '@/lib/motion';

// Components
import { BlogPreview } from '@/components/Home/BlogPreview';

// Types
import type { HomeLoaderResponse } from '@/routes/loaders/user/home';

// The newest blogs
export const LatestArticles = ({
  className,
  ...props
}: React.ComponentProps<'section'>) => {
  const { latest } = useLoaderData<HomeLoaderResponse>();

  if (latest.blogs.length === 0) return null;

  return (
    <section
      className={cn('section', className)}
      {...props}
    >
      <div className='container'>
        <div className='mb-5 flex items-end justify-between gap-4 md:mb-8'>
          <h2 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Latest articles
          </h2>

          <Link
            to='/blogs'
            viewTransition
            className='shrink-0 text-sm font-semibold text-brand underline-offset-4 hover:underline'
          >
            View all articles
          </Link>
        </div>

        <motion.ul
          className='grid gap-4 lg:grid-cols-2 xl:grid-cols-3'
          {...revealOnScroll}
          variants={stagger}
        >
          {latest.blogs.map((blog) => (
            <motion.li
              key={blog.slug}
              variants={fadeUp}
            >
              <BlogPreview blog={blog} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};