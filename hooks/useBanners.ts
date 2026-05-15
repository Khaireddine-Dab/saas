'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Banner, BannerFilter, BannerStatistics } from '@/types/banner';
import { mapBannersFromAPI } from '@/lib/banner-mapper';

export function useBanners(filters?: BannerFilter) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();
        if (filters?.status) {
          params.append('status', filters.status);
        }
        if (filters?.placement) {
          params.append('placement', filters.placement);
        }

        // Fetch banners from backend API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/banners/?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch banners: ${response.statusText}`);
        }

        const data = await response.json();
        const bannersAPI = Array.isArray(data) ? data : data.results || [];

        // Map banners from API format to frontend format
        const mappedBanners = mapBannersFromAPI(bannersAPI);
        setBanners(mappedBanners);
      } catch (err) {
        console.error('[useBanners] Error fetching banners:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch banners');
        setBanners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, [filters?.status, filters?.placement]);

  const filteredBanners = useMemo(() => {
    let result = banners;

    if (filters?.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(b => b.title.toLowerCase().includes(query));
    }

    return result;
  }, [banners, filters?.search]);

  const statistics: BannerStatistics = useMemo(() => {
    const totalImpressions = banners.reduce((sum, b) => sum + b.impressions, 0);
    const totalClicks = banners.reduce((sum, b) => sum + b.clicks, 0);
    const avgClickRate = totalImpressions > 0 ? totalClicks / totalImpressions : 0;

    return {
      totalBanners: banners.length,
      activeBanners: banners.filter(b => b.status === 'active').length,
      totalImpressions,
      totalClicks,
      avgClickRate,
    };
  }, [banners]);

  return {
    banners: filteredBanners,
    allBanners: banners,
    statistics,
    isLoading,
    error,
  };
}
