'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Promotion, PromotionFilter, PromotionStatistics } from '@/types/promotion';
import { promotionsApi } from '@/lib/api';

export function usePromotions(initialFilters?: PromotionFilter) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [statistics, setStatistics] = useState<PromotionStatistics>({
    total_promotions: 0,
    active_promotions: 0,
    upcoming_promotions: 0,
    expired_promotions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Promotions
  const fetchPromotions = useCallback(async (filters?: PromotionFilter) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const apiParams: any = {};
      if (filters?.store_id) {
        apiParams.store_id = filters.store_id;
      }
      if (filters?.active !== undefined) {
        apiParams.active = String(filters.active);
      }

      const data = await promotionsApi.getAll(apiParams);
      const list = Array.isArray(data) ? data : (data as any).results || [];
      
      // Client-side search filter as backend doesn't support query search parameter out of the box
      let filteredList = list;
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        filteredList = list.filter(
          (p: Promotion) =>
            p.title.toLowerCase().includes(query) ||
            (p.description && p.description.toLowerCase().includes(query)) ||
            (p.store_details?.name && p.store_details.name.toLowerCase().includes(query))
        );
      }

      setPromotions(filteredList);
    } catch (err) {
      console.error('[usePromotions] Error fetching promotions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch promotions');
      setPromotions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const stats = await promotionsApi.getStats();
      setStatistics(stats);
    } catch (err) {
      console.error('[usePromotions] Error fetching stats:', err);
    }
  }, []);

  // Create
  const createPromotion = async (data: any) => {
    try {
      setError(null);
      const newPromo = await promotionsApi.create(data);
      await fetchPromotions(initialFilters);
      await fetchStats();
      return newPromo;
    } catch (err) {
      console.error('[usePromotions] Error creating promotion:', err);
      throw err;
    }
  };

  // Update
  const updatePromotion = async (id: number, data: any) => {
    try {
      setError(null);
      const updatedPromo = await promotionsApi.update(id, data);
      await fetchPromotions(initialFilters);
      await fetchStats();
      return updatedPromo;
    } catch (err) {
      console.error('[usePromotions] Error updating promotion:', err);
      throw err;
    }
  };

  // Delete
  const deletePromotion = async (id: number) => {
    try {
      setError(null);
      await promotionsApi.delete(id);
      await fetchPromotions(initialFilters);
      await fetchStats();
    } catch (err) {
      console.error('[usePromotions] Error deleting promotion:', err);
      throw err;
    }
  };

  // Initial load
  useEffect(() => {
    fetchPromotions(initialFilters);
    fetchStats();
  }, [fetchPromotions, fetchStats, initialFilters?.store_id, initialFilters?.active, initialFilters?.search]);

  return {
    promotions,
    statistics,
    isLoading,
    error,
    refetch: () => {
      fetchPromotions(initialFilters);
      fetchStats();
    },
    createPromotion,
    updatePromotion,
    deletePromotion,
  };
}
