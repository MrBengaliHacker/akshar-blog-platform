import { useEffect, useRef } from 'react';
import { useLoaderData, useFetcher, useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';

// Custom modules
import { getErrorMessage } from '@/lib/utils';

// Components
import { BlogForm } from '@/components/BlogForm';

// Types
import type { ActionResponse, Blog } from '@/types';

export const BlogEdit = () => {
  const loaderData = useLoaderData() as { blog: Blog };
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const blog = loaderData.blog;

  const submittedStatus = useRef<Blog['status']>(blog.status);
  const data = fetcher.data as ActionResponse | undefined;

  useEffect(() => {
    if (!data) return;

    if (data.ok) {
      const isPublished = submittedStatus.current === 'published';

      toast.success(
        isPublished ? 'Blog Updated Successfully!' : 'Saved as Draft',
        {
          description: isPublished
            ? 'Your changes are saved.'
            : 'This blog is not visible to readers.',
        },
      );

      navigate(pathname.startsWith('/admin') ? '/admin/blogs' : '/dashboard');
    } else {
      toast.error('Failed to Update Blog', {
        description: getErrorMessage(data.err),
      });
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='max-w-3xl w-full mx-auto p-4'>
      <BlogForm
        defaultValue={{
          bannerUrl: blog.banner.url,
          title: blog.title,
          content: blog.content,
          status: blog.status,
        }}
        onSubmit={({ banner_image, title, content }, status) => {
          const formData = new FormData();

          formData.append('blogId', blog._id);
          if (banner_image) formData.append('banner_image', banner_image);
          if (title !== blog.title) formData.append('title', title);
          if (content !== blog.content) formData.append('content', content);
          if (status !== blog.status) formData.append('status', status);

          submittedStatus.current = status;

          fetcher.submit(formData, {
            method: 'patch',
            encType: 'multipart/form-data',
          });
        }}
      />
    </div>
  );
};