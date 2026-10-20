//  Node Modules
import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Custom hooks
import { notifyUserChange } from '@/hooks/useUser';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

export const aksharApi = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach the access token to every request
aksharApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Refresh the access token only once, even if many requests fail together
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = () => {
  refreshPromise ??= axios
    .post(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true })
    .then(({ data }) => {
      localStorage.setItem('accessToken', data.accessToken);
      return data.accessToken as string;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

// If the access token is expired: refresh it, then send the same request again
aksharApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const isExpired =
      error.response?.status === 401 &&
      error.response.data?.message?.includes('token expired');

    if (!original || !isExpired || original._retry) throw error;
    original._retry = true;

    try {
      const token = await refreshAccessToken();
      original.headers.Authorization = `Bearer ${token}`;
      return aksharApi(original);
    } catch (refreshError) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      notifyUserChange();

      // Public page: continue as guest
      if (original.method === 'get') {
        original.headers.delete('Authorization');
        return aksharApi(original);
      }

      window.location.href = '/login';
      throw refreshError;
    }
  },
);