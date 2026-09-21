import { useState } from 'react';

// Types
import type { User } from '@/types';

export type UserResponse = Pick<User, 'username' | 'email' | 'role'>;

export const useUser = () => {
  const [user] = useState<UserResponse | undefined>(() => {
    const userJson = localStorage.getItem('user');
    return userJson ? (JSON.parse(userJson) as UserResponse) : undefined;
  });

  return user;
};