import { useLoaderData, useFetcher } from 'react-router';
import { toast } from 'sonner';

// Components
import { BlogForm } from '@/components/BlogForm';

// Types
import type { Blog } from '@/types';

export const BlogEdit = () => {
  const loaderData = useLoaderData() as { blog: Blog };
  const fetcher = useFetcher();

  const blog = loaderData.blog;

  return (
    <div
      className='max-w-3xl w-full mx-auto p-4'
    >
      <BlogForm
      defaultValue={{
        bannerUrl: blog.banner.url,
        title: blog.title,
        content: blog.content,
        status: blog.status
      }}
        onSubmit={({ banner_image, title, content }, status) => {
          const formData = new FormData();

          formData.append("blogId", blog._id);
          if (banner_image) formData.append("banner_image", banner_image);
          if (title !== blog.title) formData.append("title", title);
          if (content !== blog.content) formData.append("content", content);
          if (status !== blog.status) formData.append("status", status);

          const submitPromise = fetcher.submit(formData, {
            method: "patch",
            encType: "multipart/form-data",
          });

          toast.promise(submitPromise, {
            loading: "Saving changes...",
            success: {
              message: "Blog Updated Successfully!",
              description: "Your blog has been updated successfully.",
            },
            error: {
              message: "Failed to Update Blog",
              description:
                "Something went wrong while updating your blog. Please try again later.",
            },
          });
        }}
      />
    </div>
  );
};