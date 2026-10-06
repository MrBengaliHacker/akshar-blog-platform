import { redirect } from 'react-router';

// Types
import type { LoaderFunction } from 'react-router';

const authGuardLoader: LoaderFunction = async () => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) return redirect('/login');

  return null;
};

export default authGuardLoader;