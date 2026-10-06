import { data } from 'react-router';

// Custom modules
import { aksharApi } from '@/api';

// Types
import type { LoaderFunction } from 'react-router';
import { AxiosError } from 'axios';

const blogDetailLoader: LoaderFunction = async ({ params }) => {
  const slug = params.slug;
  const accessToken = localStorage.getItem('accessToken');

  try {
    const { data: blogData } = await aksharApi.get(`/blogs/${slug}`);

    let liked = false;

    if (accessToken) {
      try {
        const { data: likeData } = await aksharApi.get(
          `/likes/blog/${blogData.blog._id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        liked = likeData.liked;
      } catch {
        // If like status check fails, default to not liked — don't block the whole page
        liked = false;
      }
    }

    return { ...blogData, liked };
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