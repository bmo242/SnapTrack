import { useState, useEffect } from 'react';
import { Customer } from '@/types';

const LOCAL_STORAGE_KEY = 'snaptrack-customers';

export const useCustomersPersistence = () => {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCustomers = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedCustomers ? JSON.parse(savedCustomers) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customers));
    }
  }, [customers]);

  return [customers, setCustomers] as const;
};