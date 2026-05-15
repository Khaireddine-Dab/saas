import type { Driver, DriverStatus, VehicleType, DocumentStatus } from './driver';

export interface DriverWithMetrics extends Driver {
  metrics?: DriverMetrics;
}

export interface DriverMetrics {
  totalDrivers: number;
  activeDrivers: number;
  suspendedDrivers: number;
  onBreakDrivers: number;
  offlineDrivers: number;
  avgRating: number;
  totalEarningsThisMonth: number;
  totalDeliveriesThisMonth: number;
  statusDistribution: Record<DriverStatus, number>;
}

export interface CreateDriverInput {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  vehicleType?: VehicleType;
  vehicleLicensePlate?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
}

export interface UpdateDriverInput {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  vehicleType?: VehicleType;
  vehicleLicensePlate?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  currentLat?: number;
  currentLng?: number;
  currentAddress?: string;
}

export interface UpdateDriverStatusInput {
  status: DriverStatus;
}

export interface DriverDocument {
  type: 'license' | 'id' | 'insurance' | 'registration' | 'background-check';
  status: DocumentStatus;
  expiryDate?: Date;
  verifiedAt?: Date;
}
