import { Link } from 'react-router';
import { motion } from 'motion/react';

// Custom modules
import { cn } from '@/lib/utils';
import { fadeUp, revealOnScroll } from '@/lib/motion';

// Components
import { Button } from '@/components/ui/button';

// Custom hooks
import { useUser } from '@/hooks/useUser';

// A call to write, instead of a newsletter form
export const CtaBanner = ({
  className,
  ...props
}: React.ComponentProps<'section'>) => {
  const user = useUser();

  return (
    <section
      className={cn('section', className)}
      {...props}
    >
      <div className='container'>
        <motion.div
          className='relative overflow-hidden rounded-3xl border bg-card px-6 py-12 text-center md:py-16'
          {...revealOnScroll}
          variants={fadeUp}
        >
          <div
            aria-hidden='true'
            className='hero-glow absolute left-1/2 top-0 size-105 -translate-x-1/2 -translate-y-1/2 rounded-full'
          />

          <div className='relative'>
            <h2 className='text-3xl font-bold tracking-tight md:text-4xl'>
              Have something to explain?
            </h2>

            <p className='mx-auto mt-3 max-w-xl text-lg text-muted-foreground'>
              Create a free account, write with the editor and let the AI
              assistant help you polish it.
            </p>

            <Button
              className='mt-8 h-11 px-6 text-base'
              asChild
            >
              <Link
                to={user ? '/dashboard/blogs/create' : '/signup'}
                viewTransition
              >
                {user ? 'Open the editor' : 'Create your free account'}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};