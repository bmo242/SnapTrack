import { useState, useEffect } from 'react';
import { Job } from '@/types';

const LOCAL_STORAGE_KEY = 'snaptrack-jobs';

export const useJobsPersistence = () => {
  const [jobs, setJobs] = useState<Job[]>(() => {
    // Initialize state from localStorage
    if (typeof window !== 'undefined') {
      const savedJobs = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedJobs ? JSON.parse(savedJobs) : [];
    }
    return [];
  });

  // Save jobs to localStorage whenever the jobs state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jobs));
    }
  }, [jobs]);

  return [jobs, setJobs] as const;
};