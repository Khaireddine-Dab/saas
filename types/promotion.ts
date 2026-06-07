export interface Promotion {
  id: number;
  store: number;
  store_details?: {
    id: number;
    name: string;
    description?: string;
    city?: string;
  };
  title: string;
  description?: string;
  discount_percent: number | null;
  discount_text: string | null;
  discount_display?: string;
  valid_from: string;
  valid_until: string;
  active: boolean;
  is_active?: boolean;
  is_expired?: boolean;
  is_upcoming?: boolean;
  days_remaining?: number;
  apply_to_all: boolean;
  item: number | null;
  item_details?: {
    id: number;
    name: string;
    price: number;
    image_url?: string;
  };
  target_items?: Array<{
    id: number;
    name: string;
    price: number;
  }>;
  created_at: string;
}

export interface PromotionStatistics {
  total_promotions: number;
  active_promotions: number;
  upcoming_promotions: number;
  expired_promotions: number;
}

export interface PromotionFilter {
  store_id?: number | string;
  active?: boolean | string;
  search?: string;
}
