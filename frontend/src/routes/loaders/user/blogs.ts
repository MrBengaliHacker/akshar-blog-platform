import { data } from 'react-router';

// Custom modules
import { aksharApi } from '@/api';

// Types
import type { LoaderFunction } from 'react-router';
import type { Blog, Category, PaginatedResponse } from '@/types';
import { AxiosError } from 'axios';

export type BlogsLoaderResponse = PaginatedResponse<Blog, 'blogs'> & {
  categories: Category[];
};

const userBlogLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  try {
    // The blogs (with ?category= and ?offset= from the address) and the topics with their counts
    const [blogsResponse, categoriesResponse] = await Promise.all([
      aksharApi.get('/blogs', {
        params: Object.fromEntries(url.searchParams),
      }),
      aksharApi.get('/categories'),
    ]);

    return {
      ...(blogsResponse.data as PaginatedResponse<Blog, 'blogs'>),
      categories: categoriesResponse.data.categories as Category[],
    } as BlogsLoaderResponse;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw data(err.response?.data?.message || err.message, {
        status: err.response?.status || err.status,
        statusText: err.response?.data?.code || err.code,
      });
    }

    throw err;
  }
};

export default userBlogLoader;