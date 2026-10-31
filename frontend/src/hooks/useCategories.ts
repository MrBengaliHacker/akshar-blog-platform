import { useEffect, useState } from 'react';

// Custom modules
import { aksharApi } from '@/api';

// Types
import type { Category } from '@/types';

// The list is loaded once and shared by every component that needs it
let cache: Category[] | null = null;
let request: Promise<Category[]> | null = null;

const loadCategories = () => {
  request ??= aksharApi
    .get('/categories')
    .then(({ data }) => {
      cache = data.categories as Category[];
      return cache;
    })
    .catch(() => {
      request = null; // try again the next time
      return [] as Category[];
    });

  return request;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(cache ?? []);

  useEffect(() => {
    if (cache) return;

    loadCategories().then(setCategories);
  }, []);

  return categories;
};

// Old blogs have no topic saved, they are General
export const getCategoryName = (categories: Category[], slug?: string) =>
  categories.find((category) => category.slug === (slug ?? 'general'))?.name;