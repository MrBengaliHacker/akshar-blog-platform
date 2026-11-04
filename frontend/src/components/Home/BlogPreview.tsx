// Custom modules
import { getUsername } from '@/lib/utils';

// Components
import { BlogCard } from '@/components/BlogCard';

// Types
import type { Blog } from '@/types';

type BlogPreviewProps = {
  blog: Blog;
  size?: 'default' | 'sm';
};

// A blog as a card, the same way on every part of the home page
export const BlogPreview = ({ blog, size }: BlogPreviewProps) => {
  const { slug, banner, title, content, author, category, publishedAt } = blog;

  return (
    <BlogCard
      bannerUrl={banner.url}
      bannerWidth={banner.width}
      bannerHeight={banner.height}
      title={title}
      content={content}
      slug={slug}
      authorId={author?._id}
      authorName={author ? getUsername(author) : 'Deleted User'}
      category={category}
      publishedAt={publishedAt}
      size={size}
    />
  );
};