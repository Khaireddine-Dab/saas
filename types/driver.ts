'use strict';

export type DriverStatus = 'active' | 'inactive' | 'suspended' | 'on-break' | 'offline';
export type VehicleType = 'motorcycle' | 'car' | 'van' | 'truck';
export type DocumentType = 'license' | 'id' | 'insurance' | 'registration' | 'background-check';
export type DocumentStatus = 'pending' | 'verified' | 'rejected' | 'expired';

export interface DriverDocument {
  id: string;
  type: DocumentType;
  status: DocumentStatus;
  expiryDate?: Date;
  uploadedAt: Date;
  verifiedAt?: Date;
  rejectionReason?: string;
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
  lastInspection?: Date;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: DriverStatus;
  documents: DriverDocument[];
  vehicle?: Vehicle;
  joinDate: Date;
  lastActive?: Date;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
    updatedAt: Date;
  };
  totalDeliveries: number;
  rating: number;
  completionRate: number;
  avgDeliveryTime: number;
  averageRating: number;
  acceptanceRate: number;
  earnings: {
    total: number;
    thisMonth: number;
    thisWeek: number;
  };
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
}

export interface DriverFilter {
  status?: DriverStatus;
  vehicleType?: VehicleType;
  ratingMin?: number;
  searchTerm?: string;
}

export interface DriverAnalytics {
  totalDrivers: number;
  activeDrivers: number;
  totalEarnings: number;
  avgRating: number;
  totalDeliveries: number;
}
