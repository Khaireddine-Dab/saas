import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Story } from '@/types/reels';

export interface StoryFilter {
  store_id?: number;
  is_approved?: boolean;
  search?: string;
}

export function useStories(filters?: StoryFilter) {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters?.store_id) params.append('store_id', filters.store_id.toString());
      if (filters?.is_approved !== undefined) params.append('is_approved', filters.is_approved.toString());

      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/stories/?${params.toString()}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch stories: ${response.statusText}`);
      }

      const data = await response.json();
      const storiesData = Array.isArray(data) ? data : data.results || [];
      setStories(storiesData);
    } catch (err) {
      console.error('[useStories] Error fetching stories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stories');
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.store_id, filters?.is_approved]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const filteredStories = useMemo(() => {
    let result = stories;
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(s => 
        s.caption?.toLowerCase().includes(searchLower)
      );
    }
    return result;
  }, [stories, filters?.search]);

  return {
    stories: filteredStories,
    allStories: stories,
    isLoading,
    error,
    refresh: fetchStories
  };
}
