import { useLoaderData } from 'react-router';

// Components
import { columns, BlogTable } from '@/components/BlogTable';

// Types
import type { Blog, PaginatedResponse } from '@/types';

export const MyBlogs = () => {
  const loaderData = useLoaderData() as PaginatedResponse<Blog, 'blogs'>;

  return (
    <div className='container p-4 space-y-4'>
      <h2 className='text-2xl font-semibold'>My Blogs</h2>

      <BlogTable
        columns={columns}
        data={loaderData.blogs}
      />
    </div>
  );
};