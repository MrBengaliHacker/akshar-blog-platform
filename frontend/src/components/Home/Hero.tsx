import { motion } from 'motion/react';
import { Link } from 'react-router';

// Custom modules
import { cn } from '@/lib/utils';
import { fadeIn, fadeUp, stagger } from '@/lib/motion';

// Components
import { Button } from '@/components/ui/button';

// Custom hooks
import { useUser } from '@/hooks/useUser';

// Constants
const HERO = {
  headline: 'Understand it',
  highlight: 'by explaining it.',
  text: 'Akshar is a blog for developers, designers and thinkers. Read clear explanations of modern web development, or publish your own.',
} as const;

export const Hero = ({
  className,
  ...props
}: React.ComponentProps<'section'>) => {
  const user = useUser();

  // A visitor goes to sign up, a logged in user goes straight to the editor
  const writeLink = user ? '/dashboard/blogs/create' : '/signup';

  return (
    <section
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      {/* Only light, no box */}
      <div
        aria-hidden='true'
        className='hero-glow absolute top-1/2 right-[-25%] size-120 -translate-y-1/2 rounded-full md:size-160 lg:right-[3%] lg:size-175'
      />

      <motion.div
        className='container relative grid items-center gap-10 py-12 md:py-24 lg:grid-cols-[1.2fr_0.8fr]'
        initial='from'
        animate='to'
        variants={stagger}
      >
        <div>
          <motion.h1
            className='text-4xl font-extrabold leading-[1.05] tracking-tight text-balance md:text-6xl'
            variants={fadeUp}
          >
            {HERO.headline} <span className='text-gradient'>{HERO.highlight}</span>
          </motion.h1>

          <motion.p
            className='mt-6 max-w-xl text-lg text-muted-foreground md:text-xl'
            variants={fadeUp}
          >
            {HERO.text}
          </motion.p>

          <motion.div
            className='mt-8 flex flex-wrap gap-3'
            variants={fadeUp}
          >
            <Button
              className='h-11 px-6 text-base'
              asChild
            >
              <Link
                to='/blogs'
                viewTransition
              >
                Explore articles
              </Link>
            </Button>

            <Button
              variant='outline'
              className='h-11 px-6 text-base'
              asChild
            >
              <Link
                to={writeLink}
                viewTransition
              >
                Start writing
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* The letter that gives the site its name, glowing in the light */}
        <motion.div
          aria-hidden='true'
          className='relative hidden place-items-center lg:grid'
          variants={fadeIn}
        >
          <span className='font-bengali text-gradient select-none text-[16rem] leading-none font-bold'>
            অ
          </span>

          <p className='absolute bottom-2 text-sm text-muted-foreground'>
            Akshar (অক্ষর) means &ldquo;letter&rdquo;.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};