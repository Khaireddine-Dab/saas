'use client';

export type MerchantStatus = 'pending' | 'verified' | 'active' | 'suspended' | 'banned';
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type DocumentType = 'business_license' | 'tax_id' | 'bank_account' | 'identity' | 'address_proof';

export interface MerchantDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  expiryDate?: Date;
}

export interface MerchantKYC {
  merchantId: string;
  businessName: string;
  businessType: string; // restaurant, grocery, pharmacy, etc.
  registrationNumber: string;
  taxId: string;
  panNumber?: string;
  gstNumber?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  bankAccount: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
  documents: MerchantDocument[];
  kycVerifiedAt?: Date;
  kycStatus: VerificationStatus;
}

export interface CommissionRule {
  id: string;
  merchantId?: string;
  categoryId?: string;
  type: 'fixed' | 'percentage' | 'tiered';
  baseRate: number;
  minOrder?: number;
  maxOrder?: number;
  tiers?: {
    threshold: number;
    rate: number;
  }[];
  effectiveFrom: Date;
  effectiveTo?: Date;
}

export interface MerchantPayout {
  id: string;
  merchantId: string;
  period: {
    from: Date;
    to: Date;
  };
  grossSales: number;
  refunds: number;
  commissions: number;
  adjustments: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: string;
  transactionId?: string;
  processedAt?: Date;
  nextPayoutDate?: Date;
}

export interface MerchantMetrics {
  totalOrders: number;
  totalSales: number;
  avgOrderValue: number;
  rating: number;
  reviewCount: number;
  activeListings: number;
  totalEarnings: number;
  accountBalance: number;
  payoutSchedule: string; // daily, weekly, monthly
  lastPayoutDate: Date;
  onTimeDeliveryRate: number; // percentage
  customerRetentionRate: number; // percentage
  cancellationRate: number; // percentage
}

export interface Merchant {
  id: string;
  storeName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  logo?: string;
  banner?: string;
  description?: string;
  status: MerchantStatus;
  businessType: string;
  serviceArea?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  businessHours?: {
    [day: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  rating: number;
  reviewCount: number;
  totalOrders: number;
  joinedAt: Date;
  kyc: MerchantKYC;
  commissionRules: CommissionRule[];
  metrics: MerchantMetrics;
  subscriptionTier: 'basic' | 'pro' | 'enterprise';
  payoutSettings: {
    method: 'bank_transfer' | 'wallet' | 'check';
    frequency: 'daily' | 'weekly' | 'monthly';
    minimumAmount: number;
    automatedPayouts: boolean;
  };
  settings: {
    allowReturns: boolean;
    returnWindow: number; // days
    autoApproveOrders: boolean;
    autoApproveThreshold: number;
  };
}

export interface MerchantOnboardingStep {
  step: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  completed: boolean;
  optional: boolean;
}

export interface MerchantOnboarding {
  merchantId: string;
  status: 'in_progress' | 'submitted' | 'verified' | 'rejected';
  steps: MerchantOnboardingStep[];
  rejectionReason?: string;
  submittedAt?: Date;
  verifiedAt?: Date;
  expiresAt?: Date;
}
