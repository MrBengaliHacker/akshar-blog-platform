import { Link, useLoaderData } from 'react-router';
import { motion } from 'motion/react';
import Avatar from 'react-avatar';

// Custom modules
import { cn, getUsername } from '@/lib/utils';
import { fadeUp, revealOnScroll, stagger } from '@/lib/motion';

// Types
import type { HomeLoaderResponse } from '@/routes/loaders/user/home';

const compact = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

// The writers with the most published blogs
export const Writers = ({
  className,
  ...props
}: React.ComponentProps<'section'>) => {
  const { writers } = useLoaderData<HomeLoaderResponse>();

  if (writers.length === 0) return null;

  return (
    <section
      className={cn('section', className)}
      {...props}
    >
      <div className='container'>
        <h2 className='mb-2 text-2xl font-bold tracking-tight md:text-3xl'>
          Writers on Akshar
        </h2>

        <p className='mb-6 text-muted-foreground md:mb-8'>
          Open a profile to read everything a writer has published.
        </p>

        <motion.ul
          className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'
          {...revealOnScroll}
          variants={stagger}
        >
          {writers.map((writer) => (
            <motion.li
              key={writer._id}
              variants={fadeUp}
            >
              <Link
                to={`/profile/${writer._id}`}
                viewTransition
                className='flex items-center gap-4 rounded-2xl border bg-card p-4 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow motion-reduce:transition-none motion-reduce:hover:translate-y-0'
              >
                <Avatar
                  name={getUsername(writer)}
                  src={writer.avatar || undefined}
                  size='48'
                  round
                />

                <span className='min-w-0'>
                  <span className='block truncate font-semibold'>
                    {getUsername(writer)}
                  </span>

                  <span className='block truncate text-sm text-muted-foreground'>
                    {writer.blogsCount}{' '}
                    {writer.blogsCount === 1 ? 'article' : 'articles'} ·{' '}
                    {compact.format(writer.viewsCount)} reads
                  </span>
                </span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};