import { Review } from './review';

export interface ReviewWithMetrics extends Review {
  authorDetails?: {
    id: string;
    name: string;
    email: string;
  };
  itemDetails?: {
    id: string;
    name: string;
    slug: string;
  };
  storeDetails?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ReviewMetrics {
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  spamReviews: number;
  avgRating: number;
  highRiskReviews: number;
  flaggedReviews: number;
  topProducts: string[];
}
