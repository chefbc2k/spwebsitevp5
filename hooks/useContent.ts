'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ContentOptions {
  type: 'faq' | 'help' | 'legal';
  category?: string;
  slug?: string;
}

export function useContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async ({ type, category, slug }: ContentOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ type });
      if (category) params.append('category', category);
      if (slug) params.append('slug', slug);

      const response = await fetch(`/api/content?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch content';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchContent,
    isLoading,
    error
  };
}