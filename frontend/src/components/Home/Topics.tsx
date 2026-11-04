import { Link, useLoaderData } from 'react-router';
import { motion } from 'motion/react';

// Custom modules
import { cn } from '@/lib/utils';
import { fadeUp, revealOnScroll, stagger } from '@/lib/motion';

// Assets
import {
  BookOpenIcon,
  BriefcaseIcon,
  CodeXmlIcon,
  CpuIcon,
  PenToolIcon,
  RocketIcon,
  SparklesIcon,
} from 'lucide-react';

// Types
import type { LucideIcon } from 'lucide-react';
import type { HomeLoaderResponse } from '@/routes/loaders/user/home';

// One icon for each topic. A new topic gets the book icon.
const TOPIC_ICONS: Record<string, LucideIcon> = {
  technology: CpuIcon,
  development: CodeXmlIcon,
  design: PenToolIcon,
  'ai-ml': SparklesIcon,
  startup: RocketIcon,
  career: BriefcaseIcon,
  general: BookOpenIcon,
};

// Topics that have published blogs
export const Topics = ({
  className,
  ...props
}: React.ComponentProps<'section'>) => {
  const { categories } = useLoaderData<HomeLoaderResponse>();

  const topics = categories.filter((category) => category.count > 0);

  if (topics.length === 0) return null;

  return (
    <section
      className={cn('section', className)}
      {...props}
    >
      <div className='container'>
        <h2 className='section-title'>Browse by topic</h2>

        <motion.ul
          className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'
          {...revealOnScroll}
          variants={stagger}
        >
          {topics.map(({ slug, name, count }) => {
            const Icon = TOPIC_ICONS[slug] ?? BookOpenIcon;

            return (
              <motion.li
                key={slug}
                variants={fadeUp}
              >
                <Link
                  to={`/blogs?category=${slug}`}
                  viewTransition
                  className='group flex items-center gap-4 rounded-2xl border bg-card p-4 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow motion-reduce:transition-none motion-reduce:hover:translate-y-0'
                >
                  <span className='grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-brand'>
                    <Icon className='size-5' />
                  </span>

                  <span className='min-w-0'>
                    <span className='block truncate font-semibold'>{name}</span>

                    <span className='text-sm text-muted-foreground'>
                      {count} {count === 1 ? 'article' : 'articles'}
                    </span>
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
};