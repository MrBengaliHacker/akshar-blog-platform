import { useLoaderData } from 'react-router';
import { motion } from 'motion/react';

// Custom modules
import { cn } from '@/lib/utils';
import { fadeUp, revealOnScroll, stagger } from '@/lib/motion';

// Components
import { BlogPreview } from '@/components/Home/BlogPreview';

// Types
import type { HomeLoaderResponse } from '@/routes/loaders/user/home';

// The most read blogs
export const Trending = ({
  className,
  ...props
}: React.ComponentProps<'section'>) => {
  const { trending } = useLoaderData<HomeLoaderResponse>();

  if (trending.blogs.length === 0) return null;

  return (
    <section
      className={cn('section', className)}
      {...props}
    >
      <div className='container'>
        <h2 className='mb-2 text-2xl font-bold tracking-tight md:text-3xl'>
          Trending now
        </h2>

        <p className='mb-6 text-muted-foreground md:mb-8'>
          The most read articles on Akshar.
        </p>

        <motion.ul
          className='grid gap-4 lg:grid-cols-2 lg:grid-rows-3'
          {...revealOnScroll}
          variants={stagger}
        >
          {trending.blogs.map((blog, index) => (
            <motion.li
              key={blog.slug}
              className={cn(index === 0 && 'lg:row-span-3')}
              variants={fadeUp}
            >
              <BlogPreview
                blog={blog}
                size={index > 0 ? 'sm' : 'default'}
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};