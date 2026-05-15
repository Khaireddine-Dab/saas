export interface BannerAPIResponse {
  id: number;
  store_id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  target_url: string | null;
  placement: 'homepage' | 'category' | 'checkout' | 'popup';
  status: 'draft' | 'scheduled' | 'active' | 'inactive' | 'expired';
  priority: number;
  start_date: string;
  end_date: string;
  impressions: number;
  clicks: number;
  click_rate: number;
  conversion_rate: number;
  is_active: boolean;
  is_upcoming: boolean;
  is_expired: boolean;
  days_remaining: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface BannerStatisticsResponse {
  total_banners: number;
  active_banners: number;
  scheduled_banners: number;
  expired_banners: number;
  total_impressions: number;
  total_clicks: number;
  avg_click_rate: number;
}

export interface BannerListResponse {
  count: number;
  results: BannerAPIResponse[];
}

export interface BannerStoreResponse {
  store_id: number;
  count: number;
  results: BannerAPIResponse[];
}

export interface BannerFilter {
  store_id?: number;
  status?: 'draft' | 'scheduled' | 'active' | 'inactive' | 'expired';
  placement?: 'homepage' | 'category' | 'checkout' | 'popup';
}
