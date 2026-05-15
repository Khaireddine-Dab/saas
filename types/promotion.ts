export interface Promotion {
  id: number;
  store_id: number;
  title: string;
  description: string;
  discount_percent?: number;
  discount_text?: string;
  valid_from: string;
  valid_until: string;
  active: boolean;
  item_id?: number;
  apply_to_all: boolean;
  created_at: string;
}

export interface PromotionAPIResponse {
  id: number;
  store_id: number;
  title: string;
  description: string;
  discount_percent: number | null;
  discount_text: string | null;
  valid_from: string;
  valid_until: string;
  active: boolean;
  item_id: number | null;
  apply_to_all: boolean;
  created_at: string;
}

export interface PromotionFilter {
  store_id?: number;
  active?: boolean;
  search?: string;
}
