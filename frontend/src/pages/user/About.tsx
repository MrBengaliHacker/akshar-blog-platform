import { Link } from 'react-router';

// Components
import { Page } from '@/components/Page';
import { Button } from '@/components/ui/button';

// Assets
import { BookOpenIcon, PenLineIcon, SparklesIcon } from 'lucide-react';

const FEATURES = [
  {
    Icon: BookOpenIcon,
    title: 'Read',
    text: 'Follow a growing library of articles that break down the complexities of modern web development.',
  },
  {
    Icon: PenLineIcon,
    title: 'Write',
    text: 'Create a free account and publish your own posts with a simple editor. Save drafts and publish when you are ready.',
  },
  {
    Icon: SparklesIcon,
    title: 'Get help from AI',
    text: 'Improve your writing, get title ideas or draft a full post with the built-in AI assistant.',
  },
] as const;

const TECHNOLOGIES = [
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'Cloudinary',
  'Google Gemini',
];

export const About = () => {
  return (
    <Page>
      <section className='section'>
        <div className='container max-w-3xl'>
          <h1 className='text-3xl font-semibold text-balance md:text-4xl'>
            About Akshar
          </h1>

          <p className='text-muted-foreground mt-5 md:text-lg'>
            Akshar (অক্ষর / अक्षर) means &ldquo;letter&rdquo; in Bengali and
            Hindi. It is a place for developers, designers, and thinkers to
            share ideas that matter.
          </p>

          <h2 className='text-xl font-semibold mt-10'>Why Akshar</h2>

          <p className='text-muted-foreground mt-3'>
            This blog is built on a simple principle: the best way to
            understand a topic is to explain it. Every post here is an attempt
            to explain something clearly, one bit at a time.
          </p>

          <ul className='grid gap-4 mt-8 md:grid-cols-3'>
            {FEATURES.map(({ Icon, title, text }) => (
              <li
                key={title}
                className='rounded-lg border p-4'
              >
                <Icon className='size-5 text-primary' />

                <h3 className='font-semibold mt-3'>{title}</h3>

                <p className='text-sm text-muted-foreground mt-1'>{text}</p>
              </li>
            ))}
          </ul>

          <h2 className='text-xl font-semibold mt-10'>Built with</h2>

          <ul className='flex flex-wrap gap-2 mt-3'>
            {TECHNOLOGIES.map((technology) => (
              <li
                key={technology}
                className='rounded-full border px-3 py-1 text-sm text-muted-foreground'
              >
                {technology}
              </li>
            ))}
          </ul>

          <h2 className='text-xl font-semibold mt-10'>The author</h2>

          <p className='text-muted-foreground mt-3'>
            Akshar is built and maintained by Ritam Mondal. You can find the
            links to follow along or say hello on the{' '}
            <Link
              to='/contact'
              viewTransition
              className='text-primary hover:underline'
            >
              Contact page
            </Link>
            .
          </p>

          <div className='flex flex-wrap gap-3 mt-10'>
            <Button asChild>
              <Link to='/blogs' viewTransition>
                Browse blogs
              </Link>
            </Button>

            <Button variant='outline' asChild>
              <Link to='/signup' viewTransition>
                Start writing
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Page>
  );
};