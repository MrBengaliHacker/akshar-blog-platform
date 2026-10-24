// Custom modules
import { CONTACT_EMAIL, SOCIAL_LINKS } from '@/lib/constants';

// Components
import { Page } from '@/components/Page';

// Assets
import { MailIcon } from 'lucide-react';

const cardClass =
  'flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted';

export const Contact = () => {
  return (
    <Page>
      <section className='section'>
        <div className='container max-w-3xl'>
          <h1 className='text-3xl font-semibold text-balance md:text-4xl'>
            Contact
          </h1>

          <p className='text-muted-foreground mt-5 md:text-lg'>
            Have a question, an idea or some feedback? Reach out using any of
            the links below.
          </p>

          <ul className='grid gap-4 mt-8 sm:grid-cols-2'>
            {CONTACT_EMAIL && (
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className={cardClass}
                >
                  <MailIcon className='size-5 text-primary' />

                  <div className='min-w-0'>
                    <div className='font-semibold'>Email</div>
                    <div className='text-sm text-muted-foreground truncate'>
                      {CONTACT_EMAIL}
                    </div>
                  </div>
                </a>
              </li>
            )}

            {SOCIAL_LINKS.map(({ href, Icon, label }) => (
              <li key={href}>
                <a
                  href={href}
                  target='_blank'
                  rel='noreferrer'
                  className={cardClass}
                >
                  <Icon className='size-5 text-primary' />

                  <div className='min-w-0'>
                    <div className='font-semibold'>{label}</div>
                    <div className='text-sm text-muted-foreground truncate'>
                      {href.replace('https://', '')}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Page>
  );
};