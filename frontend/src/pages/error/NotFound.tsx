import { Link } from 'react-router';

// Components
import { Page } from '@/components/Page';
import { Button } from '@/components/ui/button';

export const NotFound = () => {
  return (
    <Page>
      <section className='section'>
        <div className='container grid place-content-center place-items-center gap-4 min-h-[50dvh] text-center'>
          <p className='text-sm font-medium text-muted-foreground'>404</p>

          <h1 className='text-4xl font-semibold'>Page not found</h1>

          <p className='text-muted-foreground max-w-[60ch] text-balance'>
            The page you are looking for does not exist or was moved.
          </p>

          <Button asChild>
            <Link to='/' viewTransition>
              Go home
            </Link>
          </Button>
        </div>
      </section>
    </Page>
  );
};