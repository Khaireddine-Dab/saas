import { BusinessStatus, Coordinates, RiskLevel } from './common';

export interface Business {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  category: string;
  description: string;
  location: Coordinates;
  address: string;
  city: string;
  country: string;
  phone: string;
  website?: string;
  status: BusinessStatus;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  riskScore: number;
  riskLevel: RiskLevel;
  averageRating: number;
  totalReviews: number;
  totalProducts: number;
  totalReports: number;
  documentsVerified: boolean;
  badge?: string;
  suspended: boolean;
  suspensionReason?: string;
  createdAt: Date;
  updatedAt: Date;
  verifiedAt?: Date;
  lastActivityAt?: Date;
}

export interface BusinessDocument {
  id: string;
  businessId: string;
  type: 'license' | 'tax_id' | 'certificate' | 'registration';
  url: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: Date;
  verifiedAt?: Date;
  rejectionReason?: string;
}

export interface BusinessLocation {
  businessId: string;
  latitude: number;
  longitude: number;
  address: string;
  verified: boolean;
  duplicateCount: number;
}
