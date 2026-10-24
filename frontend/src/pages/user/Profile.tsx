import { useLoaderData } from 'react-router';
import Avatar from 'react-avatar';

// Custom Modules
import { getUsername } from '@/lib/utils';

// Components
import { Page } from '@/components/Page';
import { BlogCard } from '@/components/BlogCard';

// Assets
import { GlobeIcon } from 'lucide-react';
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa6';

// Types
import type { PublicProfileResponse } from '@/types';

// The links a user can add in Settings, in the order they are shown
const SOCIAL_ICONS = {
  website: { Icon: GlobeIcon, label: 'Website' },
  facebook: { Icon: FaFacebook, label: 'Facebook' },
  instagram: { Icon: FaInstagram, label: 'Instagram' },
  linkedin: { Icon: FaLinkedin, label: 'LinkedIn' },
  x: { Icon: FaXTwitter, label: 'X' },
  youtube: { Icon: FaYoutube, label: 'YouTube' },
} as const;

const SOCIAL_KEYS = Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[];

// A user can type "example.com", so add https:// when it is missing.
// The link always starts with http(s), never with something like "javascript:".
const toExternalUrl = (url: string) =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

export const Profile = () => {
  const { user, blogs } = useLoaderData() as PublicProfileResponse;

  const socialLinks = SOCIAL_KEYS.flatMap((key) => {
    const url = user.socialLinks?.[key];

    return url ? [{ key, url, ...SOCIAL_ICONS[key] }] : [];
  });

  return (
    <Page>
      <div className="container max-w-4xl">
        <div className="glass border-gradient rounded-3xl p-8 flex flex-col items-center text-center gap-3">
          <Avatar name={getUsername(user)} src={user.avatar || undefined} size="80" round />

          <h1 className="text-2xl font-semibold">{getUsername(user)}</h1>

          {user.bio && (
            <p className="text-muted-foreground max-w-md">{user.bio}</p>
          )}

          {socialLinks.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-4 mt-1">
              {socialLinks.map(({ key, url, Icon, label }) => (
                <li key={key}>
                  <a
                    href={toExternalUrl(url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <h2 className="section-title mt-10">
          {blogs.length > 0 ? 'Published blogs' : 'No blogs published yet'}
        </h2>

        {blogs.length > 0 && (
          <ul className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {blogs.map(({ slug, banner, title, publishedAt }) => (
              <li key={slug}>
                <BlogCard
                  bannerUrl={banner.url}
                  bannerWidth={banner.width}
                  bannerHeight={banner.height}
                  title={title}
                  slug={slug}
                  authorName={getUsername(user)}
                  publishedAt={publishedAt}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Page>
  );
};