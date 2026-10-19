import { useEffect, useRef } from 'react';
import { useFetcher, useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';

// Custom modules
import { cn, getErrorMessage } from '@/lib/utils';

// Components
import { BlogForm } from '@/components/BlogForm';

// Types
import type { ActionResponse, Blog, BlogCreateResponse } from '@/types';

export const BlogCreate = () => {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Remember what the user clicked, because fetcher.formData is empty after the request ends
  const submittedStatus = useRef<Blog['status']>('draft');

  const data = fetcher.data as ActionResponse<BlogCreateResponse> | undefined;
  const isSubmitting = fetcher.state !== 'idle';

  useEffect(() => {
    if (!data) return;

    if (data.ok) {
      const isPublished = submittedStatus.current === 'published';

      toast.success(
        isPublished ? 'Blog Published Successfully!' : 'Draft Saved Successfully!',
        {
          description: isPublished
            ? 'Your blog is now live and visible to everyone.'
            : 'Your draft is saved. Only you can see it.',
        },
      );

      navigate(pathname.startsWith('/admin') ? '/admin/blogs' : '/dashboard');
    } else {
      toast.error('Failed to Save Blog', {
        description: getErrorMessage(data.err),
      });
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={cn(
        'max-w-3xl w-full mx-auto p-4',
        isSubmitting && 'opacity-50 pointer-events-none',
      )}
    >
      <BlogForm
        onSubmit={({ banner_image, title, content }, status) => {
          if (!banner_image) {
            toast.error('Please add a cover image');
            return;
          }

          const formData = new FormData();

          formData.append('banner_image', banner_image);
          formData.append('title', title);
          formData.append('content', content);
          formData.append('status', status);

          submittedStatus.current = status;

          fetcher.submit(formData, {
            method: 'post',
            encType: 'multipart/form-data',
          });
        }}
      />
    </div>
  );
};