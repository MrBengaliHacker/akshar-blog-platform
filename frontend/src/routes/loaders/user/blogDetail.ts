import { data } from 'react-router';

// Custom modules
import { aksharApi } from '@/api';

// Types
import type { LoaderFunction } from 'react-router';
import { AxiosError } from 'axios';

const blogDetailLoader: LoaderFunction = async ({ params }) => {
  const slug = params.slug;

  try {
    const { data } = await aksharApi.get(`/blogs/${slug}`);

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

export default blogDetailLoader;