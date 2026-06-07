import type { BannerAPIResponse } from '@/types/backend-banner';
import type { Banner } from '@/types/banner';

/**
 * Helper to safely parse dates
 */
const parseDate = (dateValue: any): Date => {
  if (!dateValue) return new Date();
  const parsed = new Date(dateValue);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

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
    startDate: parseDate(bannerAPI.start_date),
    endDate: parseDate(bannerAPI.end_date),
    impressions: bannerAPI.impressions,
    clicks: bannerAPI.clicks,
    conversionRate: bannerAPI.conversion_rate,
    createdAt: parseDate(bannerAPI.created_at),
    updatedAt: parseDate(bannerAPI.updated_at),
    createdBy: bannerAPI.created_by || 'admin',
  };
}

/**
 * Map multiple banners from the backend API
 */
export function mapBannersFromAPI(bannersAPI: BannerAPIResponse[]): Banner[] {
  return bannersAPI.map(mapBannerFromAPI);
}
