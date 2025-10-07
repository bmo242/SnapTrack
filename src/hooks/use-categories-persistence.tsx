import { useState, useEffect } from 'react';
import { initialDefaultCategories } from '@/types';

const LOCAL_STORAGE_KEY = 'snaptrack-categories';

export const useCategoriesPersistence = () => {
  const [categories, setCategories] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCategories = localStorage.getItem(LOCAL_STORAGE_KEY);
      // If no saved categories, use initial defaults and add "Other" and "Uncategorized"
      const initial = savedCategories ? JSON.parse(savedCategories) : initialDefaultCategories;
      // Ensure "Other" and "Uncategorized" are always present and unique
      const uniqueCategories = new Set([...initial, "Other", "Uncategorized"]);
      return Array.from(uniqueCategories);
    }
    return [...initialDefaultCategories, "Other", "Uncategorized"];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Filter out "Other" and "Uncategorized" before saving, as they are always added on load
      const categoriesToSave = categories.filter(cat => cat !== "Other" && cat !== "Uncategorized");
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categoriesToSave));
    }
  }, [categories]);

  return [categories, setCategories] as const;
};