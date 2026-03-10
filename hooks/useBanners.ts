'use client';

import { useMemo, useState } from 'react';
import type { Banner, BannerFilter, BannerStatistics } from '@/types/banner';

const generateMockBanners = (count: number): Banner[] => {
  const placements = ['homepage', 'category', 'checkout', 'popup'] as const;
  const statuses = ['draft', 'scheduled', 'active', 'inactive', 'expired'] as const;

  return Array.from({ length: count }, (_, i) => ({
    id: `banner-${i + 1}`,
    title: `Promotional Banner ${i + 1}`,
    description: `Get amazing discounts on ${['electronics', 'clothing', 'home'][i % 3]}`,
    imageUrl: `https://via.placeholder.com/1200x400?text=Banner+${i + 1}`,
    placement: placements[i % placements.length],
    targetUrl: `/promotions/${i + 1}`,
    status: statuses[i % statuses.length],
    priority: Math.floor(Math.random() * 10) + 1,
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
    impressions: Math.floor(Math.random() * 50000) + 1000,
    clicks: Math.floor(Math.random() * 5000) + 100,
    conversionRate: Math.random() * 0.1 + 0.01,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'admin',
  }));
};

export function useBanners(filters?: BannerFilter) {
  const [banners] = useState<Banner[]>(() => generateMockBanners(12));
  const [isLoading] = useState(false);

  const filteredBanners = useMemo(() => {
    let result = banners;

    if (filters?.status) {
      result = result.filter(b => b.status === filters.status);
    }
    if (filters?.placement) {
      result = result.filter(b => b.placement === filters.placement);
    }
    if (filters?.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(b => b.title.toLowerCase().includes(query));
    }

    return result;
  }, [banners, filters]);

  const statistics: BannerStatistics = useMemo(() => ({
    totalBanners: banners.length,
    activeBanners: banners.filter(b => b.status === 'active').length,
    totalImpressions: banners.reduce((sum, b) => sum + b.impressions, 0),
    totalClicks: banners.reduce((sum, b) => sum + b.clicks, 0),
    avgClickRate: banners.reduce((sum, b) => sum + (b.clicks / b.impressions), 0) / banners.length,
  }), [banners]);

  return {
    banners: filteredBanners,
    allBanners: banners,
    statistics,
    isLoading,
  };
}
