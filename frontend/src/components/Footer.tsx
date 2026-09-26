import { Link } from 'react-router';

// Custom Modules
import { cn } from '@/lib/utils';

// Components
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

// Assets
import { FaFacebook, FaInstagram, FaXTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa6';

const SOCIAL_LINKS = [
  { href: 'https://facebook.com/ritam.mondal.470261', Icon: FaFacebook, label: 'Facebook' },
  { href: 'https://instagram.com/mr_bengali_hacker', Icon: FaInstagram, label: 'Instagram' },
  { href: 'https://x.com/MrBengaliHacker', Icon: FaXTwitter, label: 'X' },
  { href: 'https://linkedin.com/in/ritam-mondal-677944322', Icon: FaLinkedin, label: 'LinkedIn' },
  { href: 'https://youtube.com/@mr.bengali_hacker', Icon: FaYoutube, label: 'YouTube' },
] as const;

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