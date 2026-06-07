export interface ReelStat {
  reel_id: number;
  views_count: number;
  likes_count: number;
  clicks_count: number;
  contact_count: number;
  saves_count: number;
  updated_at: string;
}

export interface ReelComment {
  id: number;
  reel: number;
  user_id: string;
  content: string;
  attachment_url?: string;
  attachment_type?: string;
  created_at: string;
}

export interface Reel {
  id: number;
  store_id: number;
  media_path: string;
  media_type: string;
  title: string;
  subtitle?: string;
  price?: number;
  currency: string;
  cta_type?: string;
  cta_value?: string;
  category?: string;
  is_sponsored: boolean;
  status: string;
  created_at: string;
  item_id?: number;
  stats?: ReelStat;
  comments?: ReelComment[];
}

export interface StoryView {
  id: number;
  story: number;
  viewer_id: string;
  viewed_at: string;
}

export interface Story {
  id: number;
  store_id: number;
  author_id?: string;
  media_url: string;
  media_type: string;
  caption?: string;
  views_count: number;
  is_approved: boolean;
  expires_at: string;
  created_at: string;
  views?: StoryView[];
  is_active?: boolean;
}
