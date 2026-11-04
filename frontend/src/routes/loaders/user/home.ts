import { data } from 'react-router';

// Custom modules
import { aksharApi } from '@/api';

// Types
import type { LoaderFunction } from 'react-router';
import type { Blog, Category, PaginatedResponse, Writer } from '@/types';
import { AxiosError } from 'axios';

export interface HomeLoaderResponse {
  stats: { articles: number; writers: number; reads: number };
  trending: PaginatedResponse<Blog, 'blogs'>;
  latest: PaginatedResponse<Blog, 'blogs'>;
  categories: Category[];
  writers: Writer[];
}

// The extras (numbers, topics, writers) must not break the home page when they fail
const optional = <T>(request: Promise<{ data: T }>, fallback: T) =>
  request.then((response) => response.data).catch(() => fallback);

const homeLoader: LoaderFunction = async () => {
  try {
    const [trending, latest, stats, categories, writers] = await Promise.all([
      aksharApi.get('/blogs', { params: { sort: 'popular', limit: 4 } }),
      aksharApi.get('/blogs', { params: { limit: 6 } }),
      optional(aksharApi.get('/stats'), { articles: 0, writers: 0, reads: 0 }),
      optional(aksharApi.get('/categories'), { categories: [] as Category[] }),
      optional(aksharApi.get('/writers', { params: { limit: 4 } }), {
        writers: [] as Writer[],
      }),
    ]);

    return {
      stats,
      trending: trending.data,
      latest: latest.data,
      categories: categories.categories,
      writers: writers.writers,
    } as HomeLoaderResponse;
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

export default homeLoader;