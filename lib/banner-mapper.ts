import type { BannerAPIResponse } from '@/types/backend-banner';
import type { Banner } from '@/types/banner';

/**
 * Map a banner from the backend API to the frontend Banner format
 * Transformations:
 * - snake_case → camelCase
 * - string dates → Date objects (only for display)
 * - Backend ID (number) → Frontend ID (string)
 */
export function mapBannerFromAPI(bannerAPI: BannerAPIResponse): Banner {
  return {
    id: String(bannerAPI.id),
    title: bannerAPI.title,
    description: bannerAPI.description || '',
    imageUrl: bannerAPI.image_url || '',
    placement: bannerAPI.placement,
    targetUrl: bannerAPI.target_url || '',
    status: bannerAPI.status,
    priority: bannerAPI.priority,
    startDate: new Date(bannerAPI.start_date),
    endDate: new Date(bannerAPI.end_date),
    impressions: bannerAPI.impressions,
    clicks: bannerAPI.clicks,
    conversionRate: bannerAPI.conversion_rate,
    createdAt: new Date(bannerAPI.created_at),
    updatedAt: new Date(bannerAPI.updated_at),
    createdBy: bannerAPI.created_by || 'admin',
  };
}

/**
 * Map multiple banners from the backend API
 */
export function mapBannersFromAPI(bannersAPI: BannerAPIResponse[]): Banner[] {
  return bannersAPI.map(mapBannerFromAPI);
}
