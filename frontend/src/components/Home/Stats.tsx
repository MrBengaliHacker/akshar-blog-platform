import { useLoaderData } from 'react-router';
import { motion } from 'motion/react';

// Custom modules
import { cn } from '@/lib/utils';
import { fadeUp, revealOnScroll, stagger } from '@/lib/motion';

// Components
import { CountUp } from '@/components/CountUp';

// Types
import type { HomeLoaderResponse } from '@/routes/loaders/user/home';

// Real numbers, counted from the published blogs
export const Stats = ({
  className,
  ...props
}: React.ComponentProps<'section'>) => {
  const { stats } = useLoaderData<HomeLoaderResponse>();

  const items = [
    { value: stats.articles, label: 'articles published' },
    { value: stats.writers, label: 'writers' },
    { value: stats.reads, label: 'reads' },
  ];

  return (
    <section
      className={cn('border-y', className)}
      {...props}
    >
      <motion.ul
        className='container grid grid-cols-3 gap-4 py-6 md:py-8'
        {...revealOnScroll}
        variants={stagger}
      >
        {items.map(({ value, label }) => (
          <motion.li
            key={label}
            variants={fadeUp}
          >
            <CountUp
              value={value}
              className='block font-display text-3xl font-bold tracking-tight md:text-4xl'
            />

            <span className='text-sm text-muted-foreground'>{label}</span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
};