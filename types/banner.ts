export type BannerPlacement = 'homepage' | 'category' | 'checkout' | 'popup';
export type BannerStatus = 'draft' | 'scheduled' | 'active' | 'inactive' | 'expired';

export interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  placement: BannerPlacement;
  targetUrl?: string;
  status: BannerStatus;
  priority: number;
  startDate: Date;
  endDate: Date;
  impressions: number;
  clicks: number;
  conversionRate: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface BannerStatistics {
  totalBanners: number;
  activeBanners: number;
  totalImpressions: number;
  totalClicks: number;
  avgClickRate: number;
}

export interface BannerPerformance {
  bannerId: string;
  title: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
}

export interface BannerFilter {
  status?: BannerStatus;
  placement?: BannerPlacement;
  search?: string;
}
