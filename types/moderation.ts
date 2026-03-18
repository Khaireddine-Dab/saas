// ─── Moderation Types ──────────────────────────────────────────────────────

export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged' | 'reported';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface ReportReason {
  id: string;
  reason: 'fake_product' | 'misleading_description' | 'wrong_price' | 'illegal_item' | 'spam_listing';
  label: string;
  reportedBy: string;
  reportedAt: string;
}

export interface RiskIndicator {
  type: 'new_seller' | 'low_price' | 'suspicious_keywords' | 'repeated_images' | 'too_many_reports' | 'duplicate_product';
  label: string;
  severity: RiskLevel;
}

export interface ModerationProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  images: string[];

  // Seller
  sellerId: string;
  sellerName: string;
  businessName: string;
  sellerRegisteredAt: string;
  sellerTrustScore: number;
  sellerTotalProducts: number;

  // Moderation
  status: ModerationStatus;
  riskLevel: RiskLevel;
  riskIndicators: RiskIndicator[];
  reports: ReportReason[];
  totalReports: number;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;

  // Metrics
  averageRating: number;
  totalSales: number;
}

export interface ModerationStats {
  pendingReview: number;
  approvedToday: number;
  rejectedToday: number;
  reported: number;
  highRisk: number;
  totalProducts: number;
}

export type BulkAction = 'approve' | 'reject' | 'flag' | 'delete';