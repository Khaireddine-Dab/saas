import { ReviewStatus, RiskLevel } from './common';

export interface Review {
  id: string;
  productId: string;
  productName: string;
  businessId: string;
  businessName: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  status: ReviewStatus;
  spamScore: number;
  riskLevel: RiskLevel;
  flagged: boolean;
  flagCount: number;
  helpful: number;
  unhelpful: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewFlag {
  id: string;
  reviewId: string;
  reason: 'spam' | 'fake' | 'inappropriate' | 'duplicate' | 'other';
  count: number;
  status: 'pending' | 'reviewed' | 'resolved';
  description?: string;
}

export interface SpamDetectionResult {
  reviewId: string;
  spamScore: number;
  riskLevel: RiskLevel;
  indicators: string[];
  confidence: number;
}

export interface HighRiskUser {
  userId: string;
  userName: string;
  email: string;
  suspiciousReviewCount: number;
  bannedCount: number;
  averageSpamScore: number;
  riskLevel: RiskLevel;
  lastActivity: Date;
}
