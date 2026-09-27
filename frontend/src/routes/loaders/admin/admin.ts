import { data, redirect } from 'react-router';

// Custom modules
import { aksharApi } from '@/api';

// Types
import type { LoaderFunction } from 'react-router';
import { AxiosError } from 'axios';

const adminLoader: LoaderFunction = async () => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) return redirect('/');
  try {
    const { data: response } = await aksharApi .get('/users/current', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.user.role !== 'admin') return redirect('/');
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

export default adminLoader;