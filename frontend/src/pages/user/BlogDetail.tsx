import { useCallback, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { toast } from 'sonner';

// Custom Modules
import { getUsername, getReadingTime } from '@/lib/utils';
import { aksharApi } from '@/api';

// Components
import { Page } from '@/components/Page';
import Avatar from 'react-avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { CommentSection } from '@/components/CommentSection';

// Custom hooks
import { useUser } from '@/hooks/useUser';

// Assets
import {
  ArrowLeftIcon,
  LinkIcon,
  MessageSquareIcon,
  ShareIcon,
  ThumbsUpIcon,
} from 'lucide-react';
import { FaFacebook, FaLinkedin, FaXTwitter } from 'react-icons/fa6';

// Types
import type { Blog } from '@/types';
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

interface ShareDropdownProps extends DropdownMenuProps {
  blogTitle: string;
}

export const ShareDropdown = ({
  blogTitle,
  children,
  ...props
}: ShareDropdownProps) => {
  const blogUrl = window.location.href;
  const shareText = 'Just read this insightful article and wanted to share!';

  const SHARE_LINKS = {
    x: `https://x.com/intent/post?url=${encodeURIComponent(blogUrl)}&text=${encodeURIComponent(`${shareText} ${blogTitle}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(blogUrl)}&title=${encodeURIComponent(blogTitle)}&summary=${encodeURIComponent(shareText)}`,
  };

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(blogUrl);
      toast.success('Link copied!');
    } catch (err) {
      toast.error('Failed to copy!');
      console.error('Failed to copy: ', err);
    }
  }, [blogUrl]);

  const shareOnSocial = useCallback((platformUrl: string) => {
    window.open(platformUrl, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent className='min-w-60'>
        <DropdownMenuItem onSelect={handleCopy}>
          <LinkIcon />
          Copy link
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={() => shareOnSocial(SHARE_LINKS.x)}>
          <FaXTwitter />
          Share on X
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={() => shareOnSocial(SHARE_LINKS.facebook)}>
          <FaFacebook />
          Share on Facebook
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={() => shareOnSocial(SHARE_LINKS.linkedin)}>
          <FaLinkedin />
          Share on LinkedIn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const BlogDetail = () => {
  const navigate = useNavigate();
  const user = useUser();

  const { blog, liked: initialLiked } = useLoaderData() as {
    blog: Blog;
    liked: boolean;
  };

  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(blog.likesCount);
  const [isLiking, setIsLiking] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: blog.content,
    editable: false,
    autofocus: false,
  });

  const handleLikeToggle = useCallback(async () => {
    if (!user) {
      toast.error('Please login to like this blog');
      return;
    }

    if (isLiking) return;

    const accessToken = localStorage.getItem('accessToken');
    const prevLiked = liked;
    const prevCount = likesCount;

    setLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);
    setIsLiking(true);

    try {
      if (prevLiked) {
        await aksharApi.delete(`/likes/blog/${blog._id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } else {
        await aksharApi.post(
          `/likes/blog/${blog._id}`,
          {},
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      }
    } catch (err) {
      setLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error('Something went wrong, please try again');
    } finally {
      setIsLiking(false);
    }
  }, [liked, likesCount, isLiking, user, blog._id]);

  return (
    <Page>
      <article className='relative container max-w-180 pt-6 pb-12'>
        <Button
          variant='outline'
          size='icon'
          className='sticky top-22 -ms-16'
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon />
        </Button>

        <h1 className='text-4xl leading-tight font-semibold -mt-10'>
          {blog.title}
        </h1>

        <div className='flex items-center gap-3 my-8'>
          <div className='flex items-center gap-3'>
            <Avatar name={getUsername(blog.author)} email={blog.author.email} size='32' round />
            <span>{getUsername(blog.author)}</span>
          </div>

          <Separator orientation='vertical' className='data-vertical:h-1 data-vertical:w-1 rounded-full' />

          <div className='text-muted-foreground'>
            {getReadingTime(editor?.getText() ?? '')} min read
          </div>

          <Separator orientation='vertical' className='data-vertical:h-1 data-vertical:w-1 rounded-full' />

          <div className='text-muted-foreground'>
            {new Date(blog.publishedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
          </div>
        </div>

        <Separator />

        <div className='flex items-center gap-2 my-2'>
          <Button
            variant='ghost'
            onClick={handleLikeToggle}
            disabled={isLiking}
            className={liked ? 'text-primary' : undefined}
          >
            <ThumbsUpIcon className={liked ? 'fill-current' : undefined} />
            {likesCount}
          </Button>

          <Button variant='ghost' asChild>
            <a href='#comments'>
              <MessageSquareIcon />
              {blog.commentsCount}
            </a>
          </Button>

          <ShareDropdown blogTitle={blog.title}>
            <Button variant='ghost' className='ms-auto'>
              <ShareIcon />
              Share
            </Button>
          </ShareDropdown>
        </div>

        <Separator />

        <div className='my-8'>
          <AspectRatio ratio={21 / 9} className='overflow-hidden rounded-xl bg-border'>
            <img
              src={blog.banner.url}
              width={blog.banner.width}
              height={blog.banner.height}
              alt={`Banner of blog: ${blog.title}`}
              className='w-full h-full object-cover'
            />
          </AspectRatio>
        </div>

        <EditorContent editor={editor} />

        <Separator className='my-10' />

        <div id='comments'>
          <CommentSection blogId={blog._id} commentsCount={blog.commentsCount} />
        </div>
      </article>
    </Page>
  );
};