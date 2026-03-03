import { ProductStatus } from './common';

export interface Product {
  id: string;
  businessId: string;
  businessName: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  images: string[];
  status: ProductStatus;
  totalReports: number;
  flaggedCount: number;
  averageRating: number;
  reviewCount: number;
  visibility: 'public' | 'private' | 'hidden';
  featured: boolean;
  featuredUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastModeratedAt?: Date;
}

export interface ProductModerationNote {
  id: string;
  productId: string;
  adminId: string;
  adminName: string;
  note: string;
  action: 'flag' | 'hide' | 'ban' | 'approve' | 'other';
  createdAt: Date;
}

export interface ProductReport {
  id: string;
  productId: string;
  reason: 'spam' | 'inappropriate' | 'fake' | 'misleading' | 'other';
  count: number;
  status: 'open' | 'closed';
}
