import { useLoaderData } from 'react-router';
import Avatar from 'react-avatar';

// Custom Modules
import { getUsername } from '@/lib/utils';

// Components
import { Page } from '@/components/Page';
import { BlogCard } from '@/components/BlogCard';

// Types
import type { PublicProfileResponse } from '@/types';

export const Profile = () => {
  const { user, blogs } = useLoaderData() as PublicProfileResponse;

  return (
    <Page>
      <div className="container max-w-4xl">
        <div className="glass border-gradient rounded-3xl p-8 flex flex-col items-center text-center gap-3">
          <Avatar name={getUsername(user)} src={user.avatar} size="80" round />

          <h1 className="text-2xl font-semibold">{getUsername(user)}</h1>

          {user.bio && (
            <p className="text-muted-foreground max-w-md">{user.bio}</p>
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