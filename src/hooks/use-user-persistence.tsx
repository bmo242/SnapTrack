import { useState, useEffect } from 'react';
import { User, defaultUser } from '@/types';

const LOCAL_STORAGE_KEY = 'snaptrack-user';

export const useUserPersistence = () => {
  const [user, setUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : defaultUser;
    }
    return defaultUser;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  return [user, setUser] as const;
};