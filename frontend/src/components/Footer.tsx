import { Link } from 'react-router';

// Custom Modules
import { cn } from '@/lib/utils';
import { SOCIAL_LINKS } from '@/lib/constants';

// Components
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Blog', to: '/blogs' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],
  Account: [
    { label: 'Sign In', to: '/login' },
    { label: 'Sign Up', to: '/signup' },
    { label: 'Dashboard', to: '/admin/dashboard' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
  ],
} as const;

export const Footer = ({ className, ...props }: React.ComponentProps<'footer'>) => {
  return (
    <footer className={cn('border-t glass', className)} {...props}>
      <div className="container py-12 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            A place for developers, designers, and thinkers to share ideas that matter.
          </p>

          <ul className="flex items-center gap-1 mt-5">
            {SOCIAL_LINKS.map(({ href, Icon, label }) => (
              <li key={href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={label} asChild>
                      <a href={href} target="_blank" rel="noreferrer">
                        <Icon size={18} />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {heading}
            </h3>
            <ul className="mt-4 space-y-3">
              {links.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    viewTransition
                    className="text-sm text-foreground/80 hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Separator />

      <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Akshar. All rights reserved.</p>
        <p>Made by Mr. Bengali Hacker</p>
      </div>
    </footer>
  );
};