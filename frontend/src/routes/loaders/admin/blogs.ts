import { data } from 'react-router';

// Custom modules
import { aksharApi } from '@/api';

// Types
import type { LoaderFunction } from 'react-router';
import type { PaginatedResponse, Blog} from '@/types';
import { AxiosError } from 'axios';

const allBlogLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const offset = url.searchParams.get('offset') || 0;
  const limit = url.searchParams.get('limit') || 10;

  try {
    const response = await aksharApi .get('/blogs', {
      params: { offset, limit }
    });
    const data = response.data as PaginatedResponse<Blog, 'blogs'>;
    
    return data;
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

export default allBlogLoader;