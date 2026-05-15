/**
 * Mappers pour transformer les données du backend drivers vers les types frontend
 */

import type { Driver, DriverDocument, Vehicle } from '@/types/driver';

/**
 * Transforme les données brutes du backend en type Driver
 */
export function mapBackendDriverToFrontend(backendDriver: any): Driver {
  const documents: DriverDocument[] = [];

  // Mapper les documents
  if (backendDriver.license_status || backendDriver.license_expiry_date) {
    documents.push({
      id: `${backendDriver.id}-license`,
      type: 'license',
      status: backendDriver.license_status || 'pending',
      expiryDate: backendDriver.license_expiry_date
        ? new Date(backendDriver.license_expiry_date)
        : undefined,
      uploadedAt: backendDriver.license_verified_at
        ? new Date(backendDriver.license_verified_at)
        : new Date(),
      verifiedAt: backendDriver.license_verified_at
        ? new Date(backendDriver.license_verified_at)
        : undefined,
    });
  }

  if (backendDriver.id_status || backendDriver.id_expiry_date) {
    documents.push({
      id: `${backendDriver.id}-id`,
      type: 'id',
      status: backendDriver.id_status || 'pending',
      expiryDate: backendDriver.id_expiry_date
        ? new Date(backendDriver.id_expiry_date)
        : undefined,
      uploadedAt: backendDriver.id_verified_at
        ? new Date(backendDriver.id_verified_at)
        : new Date(),
      verifiedAt: backendDriver.id_verified_at
        ? new Date(backendDriver.id_verified_at)
        : undefined,
    });
  }

  if (backendDriver.insurance_status || backendDriver.insurance_expiry_date) {
    documents.push({
      id: `${backendDriver.id}-insurance`,
      type: 'insurance',
      status: backendDriver.insurance_status || 'pending',
      expiryDate: backendDriver.insurance_expiry_date
        ? new Date(backendDriver.insurance_expiry_date)
        : undefined,
      uploadedAt: backendDriver.insurance_verified_at
        ? new Date(backendDriver.insurance_verified_at)
        : new Date(),
      verifiedAt: backendDriver.insurance_verified_at
        ? new Date(backendDriver.insurance_verified_at)
        : undefined,
    });
  }

  if (backendDriver.registration_status || backendDriver.registration_expiry_date) {
    documents.push({
      id: `${backendDriver.id}-registration`,
      type: 'registration',
      status: backendDriver.registration_status || 'pending',
      expiryDate: backendDriver.registration_expiry_date
        ? new Date(backendDriver.registration_expiry_date)
        : undefined,
      uploadedAt: backendDriver.registration_verified_at
        ? new Date(backendDriver.registration_verified_at)
        : new Date(),
      verifiedAt: backendDriver.registration_verified_at
        ? new Date(backendDriver.registration_verified_at)
        : undefined,
    });
  }

  if (backendDriver.background_check_status || backendDriver.background_check_expiry_date) {
    documents.push({
      id: `${backendDriver.id}-background-check`,
      type: 'background-check',
      status: backendDriver.background_check_status || 'pending',
      expiryDate: backendDriver.background_check_expiry_date
        ? new Date(backendDriver.background_check_expiry_date)
        : undefined,
      uploadedAt: backendDriver.background_check_verified_at
        ? new Date(backendDriver.background_check_verified_at)
        : new Date(),
      verifiedAt: backendDriver.background_check_verified_at
        ? new Date(backendDriver.background_check_verified_at)
        : undefined,
    });
  }

  // Mapper le véhicule
  let vehicle: Vehicle | undefined;
  if (backendDriver.vehicle_type) {
    vehicle = {
      id: `${backendDriver.id}-vehicle`,
      type: backendDriver.vehicle_type,
      licensePlate: backendDriver.vehicle_license_plate || '',
      make: backendDriver.vehicle_make || 'Unknown',
      model: backendDriver.vehicle_model || 'Unknown',
      year: backendDriver.vehicle_year || new Date().getFullYear(),
      capacity: backendDriver.vehicle_capacity_kg || 50,
      status: backendDriver.vehicle_status || 'active',
      lastInspection: backendDriver.vehicle_last_inspection
        ? new Date(backendDriver.vehicle_last_inspection)
        : undefined,
    };
  }

  return {
    id: String(backendDriver.id),
    name: backendDriver.name || 'Unknown',
    email: backendDriver.email || '',
    phone: backendDriver.phone || '',
    status: backendDriver.status || 'inactive',
    documents: documents,
    vehicle: vehicle,
    joinDate: new Date(backendDriver.join_date),
    lastActive: backendDriver.last_active
      ? new Date(backendDriver.last_active)
      : undefined,
    currentLocation: backendDriver.current_lat && backendDriver.current_lng
      ? {
          lat: parseFloat(backendDriver.current_lat),
          lng: parseFloat(backendDriver.current_lng),
          address: backendDriver.current_address || '',
          updatedAt: backendDriver.location_updated_at
            ? new Date(backendDriver.location_updated_at)
            : new Date(),
        }
      : undefined,
    totalDeliveries: backendDriver.total_deliveries || 0,
    rating: parseFloat(backendDriver.rating) || 5.0,
    completionRate: parseFloat(backendDriver.completion_rate) || 100,
    avgDeliveryTime: backendDriver.avg_delivery_time_minutes || 0,
    averageRating: parseFloat(backendDriver.rating) || 5.0,
    acceptanceRate: parseFloat(backendDriver.acceptance_rate) || 100,
    earnings: {
      total: parseFloat(backendDriver.total_earnings) || 0,
      thisMonth: parseFloat(backendDriver.earnings_this_month) || 0,
      thisWeek: parseFloat(backendDriver.earnings_this_week) || 0,
    },
    bankAccount: backendDriver.bank_name
      ? {
          bankName: backendDriver.bank_name,
          accountNumber: backendDriver.account_number || '',
          accountHolder: backendDriver.account_holder || '',
        }
      : undefined,
  };
}

/**
 * Transforme plusieurs drivers
 */
export function mapBackendDriversToFrontend(backendDrivers: any[]): Driver[] {
  return backendDrivers.map(mapBackendDriverToFrontend);
}
