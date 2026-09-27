import { data } from 'react-router';

// Custom modules
import { aksharApi } from '@/api';

// Types
import type { LoaderFunction } from 'react-router';
import type { PublicProfileResponse } from '@/types';
import { AxiosError } from 'axios';

const profileLoader: LoaderFunction = async ({ params }) => {
  const userId = params.userId;

  try {
    const { data: response } = await aksharApi.get(`/users/profile/${userId}`);
    return response as PublicProfileResponse;
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

export default profileLoader;