import { useMemo, useSyncExternalStore } from 'react';

// Types
import type { User } from '@/types';

export type UserResponse = Pick<User, '_id' | 'username' | 'email' | 'role'> & {
  avatar?: string;
};

// Components that use useUser() re-render when the saved user changes
const listeners = new Set<() => void>();

export const notifyUserChange = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener('storage', listener); // changes from other tabs

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
};

const getSnapshot = () => localStorage.getItem('user');

export const useUser = () => {
  const userJson = useSyncExternalStore(subscribe, getSnapshot);

  return useMemo(
    () => (userJson ? (JSON.parse(userJson) as UserResponse) : undefined),
    [userJson],
  );
};