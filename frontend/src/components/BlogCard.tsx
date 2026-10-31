import { Link } from 'react-router';
import { useMemo } from 'react';
import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { formatDistanceToNowStrict } from 'date-fns';

// Custom modules
import { cn } from '@/lib/utils';
import { getCategoryName, useCategories } from '@/hooks/useCategories';

// Components
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { AspectRatio } from './ui/aspect-ratio';
import { Badge } from './ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

// Types
interface BlogCardProps extends React.ComponentProps<'div'> {
  bannerUrl: string;
  bannerWidth: number;
  bannerHeight: number;
  title: string;
  content?: string;
  slug: string;
  authorName: string;
  authorId?: string;
  category?: string;
  publishedAt: string;
  size?: 'default' | 'sm';
}

export const BlogCard: React.FC<BlogCardProps> = ({
  bannerUrl,
  bannerWidth,
  bannerHeight,
  title,
  content,
  slug,
  authorName,
  authorId,
  category,
  publishedAt,
  size = 'default',
  className,
  ...props
}) => {
  const categories = useCategories();
  const categoryName = getCategoryName(categories, category);
  const plainText = useMemo(() => {
    if (!content) return '';
    const editor = new Editor({
      extensions: [StarterKit],
      content,
      editable: false,
      autofocus: false,
    });
    const text = editor.getText();
    editor.destroy();
    return text;
  }, [content]);

  return (
    <Card
      className={cn(
        'relative group pt-2 h-full @container transition duration-300 hover:-translate-y-1 hover:shadow-glow hover:ring-primary/30 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        size === 'default' && 'flex flex-col-reverse justify-end',
        size === 'sm' && 'py-2 grid grid-cols-[1fr_1.15fr] gap-0 items-center',
        className,
      )}
      {...props}
    >
      <CardHeader
        className={cn(
          'gap-2',
          size === 'sm' && 'content-center order-1 ps-4 py-3',
        )}
      >
        <div className='flex items-center gap-2 text-muted-foreground text-sm font-medium'>
          <p className='@max-3xs:hidden'>
            {authorId ? (
              <Link
                to={`/profile/${authorId}`}
                viewTransition
                className='underline-offset-4 hover:underline'
              >
                {authorName}
              </Link>
            ) : (
              authorName
            )}
          </p>

          <div className='w-1 h-1 rounded-full bg-muted-foreground/50 @max-3xs:hidden'></div>

          <Tooltip delayDuration={250}>
            <TooltipTrigger>
              {formatDistanceToNowStrict(publishedAt, { addSuffix: true })}
            </TooltipTrigger>

            <TooltipContent>
              {new Date(publishedAt).toLocaleString('en-US', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </TooltipContent>
          </Tooltip>
        </div>

        {size === 'default' && categoryName && (
          <Link
            to={`/blogs?category=${category ?? 'general'}`}
            viewTransition
            className='w-fit'
          >
            <Badge
              variant='secondary'
              className='hover:bg-primary/15'
            >
              {categoryName}
            </Badge>
          </Link>
        )}
                
        <Link
          to={`/blogs/${slug}`}
          viewTransition
        >
          <CardTitle
            className={cn(
              'underline-offset-4 hover:underline leading-tight line-clamp-2',
              size === 'default' && 'text-xl @md:text-2xl',
            )}
          >
            {title}
          </CardTitle>
        </Link>

        <CardDescription
          className={cn(
            'line-clamp-2 text-balance',
            size === 'sm' && '@max-2xs:hidden',
          )}
        >
          {plainText}
        </CardDescription>
      </CardHeader>

      <CardContent className='px-2'>
        <Link to={`/blogs/${slug}`} viewTransition>
          <AspectRatio ratio={21 / 9} className='rounded-lg overflow-hidden'>
            <img
              src={bannerUrl}
              width={bannerWidth}
              height={bannerHeight}
              alt={title}
              className='w-full h-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100'
            />
          </AspectRatio>
        </Link>
      </CardContent>
    </Card>
  );
};