import { data } from 'react-router';

// Custom modules
import { aksharApi } from '@/api';

// Types
import type { LoaderFunction } from 'react-router';
import type { PaginatedResponse, Blog } from '@/types';
import type { UserResponse } from '@/hooks/useUser';
import { AxiosError } from 'axios';

const myBlogsLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const userJson = localStorage.getItem('user');

  if (!userJson) {
    throw data('Not authenticated', {
      status: 401,
      statusText: 'AuthenticationError',
    });
  }

  const user = JSON.parse(userJson) as UserResponse;

  try {
    const response = await aksharApi.get(`/blogs/user/${user._id}`, {
      params: Object.fromEntries(url.searchParams.entries()),
    });

    return response.data as PaginatedResponse<Blog, 'blogs'>;
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

export default myBlogsLoader;