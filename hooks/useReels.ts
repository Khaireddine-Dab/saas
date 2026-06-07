import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Reel } from '@/types/reels';

export interface ReelFilter {
  store_id?: number;
  status?: string;
  category?: string;
  search?: string;
}

export function useReels(filters?: ReelFilter) {
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReels = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters?.store_id) params.append('store_id', filters.store_id.toString());
      if (filters?.status) params.append('status', filters.status);
      if (filters?.category) params.append('category', filters.category);

      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/reels/?${params.toString()}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch reels: ${response.statusText}`);
      }

      const data = await response.json();
      const reelsData = Array.isArray(data) ? data : data.results || [];
      setReels(reelsData);
    } catch (err) {
      console.error('[useReels] Error fetching reels:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reels');
      setReels([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.store_id, filters?.status, filters?.category]);

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  const filteredReels = useMemo(() => {
    let result = reels;
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(r => 
        r.title?.toLowerCase().includes(searchLower) || 
        r.subtitle?.toLowerCase().includes(searchLower)
      );
    }
    return result;
  }, [reels, filters?.search]);

  return {
    reels: filteredReels,
    allReels: reels,
    isLoading,
    error,
    refresh: fetchReels
  };
}
