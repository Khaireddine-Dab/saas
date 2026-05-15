'use client';

import { useCallback, useMemo, useState } from 'react';
import { driversApi } from '@/lib/api';
import { mapBackendDriverToFrontend, mapBackendDriversToFrontend } from '@/lib/driver-mapper';
import type { Driver, DriverFilter, DriverStatus } from '@/types/driver';
import type { DriverMetrics } from '@/types/driver-extended';

interface UseDriversReturn {
  drivers: Driver[];
  allDrivers: Driver[];
  isLoading: boolean;
  error: string | null;
  metrics: DriverMetrics;
  fetchDrivers: () => Promise<void>;
  fetchDriverById: (id: string) => Promise<Driver>;
  updateDriverStatus: (driverId: string, status: DriverStatus) => Promise<Driver>;
  updateDriver: (driverId: string, data: any) => Promise<Driver>;
  deleteDriver: (driverId: string) => Promise<void>;
  createDriver: (data: any) => Promise<Driver>;
  searchDrivers: (query: string) => Promise<Driver[]>;
  getDriversByStatus: (status: DriverStatus) => Promise<Driver[]>;
  getDriversByVehicleType: (vehicleType: string) => Promise<Driver[]>;
}

export function useDrivers(filters?: DriverFilter): UseDriversReturn {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all drivers
  const fetchDrivers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await driversApi.getAll();
      const mappedDrivers = mapBackendDriversToFrontend(Array.isArray(data) ? data : []);
      setDrivers(mappedDrivers);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des livreurs';
      setError(message);
      console.error('Error fetching drivers:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch driver by ID
  const fetchDriverById = useCallback(async (id: string): Promise<Driver> => {
    setError(null);
    try {
      const data = await driversApi.getById(id);
      return mapBackendDriverToFrontend(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement du livreur';
      setError(message);
      throw err;
    }
  }, []);

  // Search drivers
  const searchDrivers = useCallback(async (query: string): Promise<Driver[]> => {
    setError(null);
    try {
      const data = await driversApi.search(query);
      return mapBackendDriversToFrontend(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la recherche de livreurs';
      setError(message);
      throw err;
    }
  }, []);

  // Get drivers by status
  const getDriversByStatus = useCallback(async (status: DriverStatus): Promise<Driver[]> => {
    setError(null);
    try {
      const data = await driversApi.getByStatus(status);
      return mapBackendDriversToFrontend(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des livreurs';
      setError(message);
      throw err;
    }
  }, []);

  // Get drivers by vehicle type
  const getDriversByVehicleType = useCallback(async (vehicleType: string): Promise<Driver[]> => {
    setError(null);
    try {
      const data = await driversApi.getByVehicleType(vehicleType);
      return mapBackendDriversToFrontend(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des livreurs';
      setError(message);
      throw err;
    }
  }, []);

  // Update driver status
  const updateDriverStatus = useCallback(async (driverId: string, status: DriverStatus): Promise<Driver> => {
    setError(null);
    try {
      const response = await driversApi.updateStatus(driverId, status);
      const updatedDriver = mapBackendDriverToFrontend(response);
      setDrivers(prev => prev.map(d => d.id === driverId ? updatedDriver : d));
      return updatedDriver;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut';
      setError(message);
      throw err;
    }
  }, []);

  // Update full driver
  const updateDriver = useCallback(async (driverId: string, data: any): Promise<Driver> => {
    setError(null);
    try {
      const response = await driversApi.update(driverId, data);
      const updatedDriver = mapBackendDriverToFrontend(response);
      setDrivers(prev => prev.map(d => d.id === driverId ? updatedDriver : d));
      return updatedDriver;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du livreur';
      setError(message);
      throw err;
    }
  }, []);

  // Delete driver
  const deleteDriver = useCallback(async (driverId: string) => {
    setError(null);
    try {
      await driversApi.delete(driverId);
      setDrivers(prev => prev.filter(d => d.id !== driverId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression du livreur';
      setError(message);
      throw err;
    }
  }, []);

  // Create driver
  const createDriver = useCallback(async (data: any): Promise<Driver> => {
    setError(null);
    try {
      const response = await driversApi.create(data);
      const newDriver = mapBackendDriverToFrontend(response);
      setDrivers(prev => [...prev, newDriver]);
      return newDriver;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création du livreur';
      setError(message);
      throw err;
    }
  }, []);

  // Filter drivers
  const filteredDrivers = useMemo(() => {
    let result = drivers;

    if (filters?.status) {
      result = result.filter(d => d.status === filters.status);
    }
    if (filters?.vehicleType) {
      result = result.filter(d => d.vehicle?.type === filters.vehicleType);
    }
    if (filters?.ratingMin) {
      result = result.filter(d => d.rating >= filters.ratingMin!);
    }
    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(term) ||
        d.email.toLowerCase().includes(term) ||
        d.phone.includes(term)
      );
    }

    return result;
  }, [drivers, filters]);

  // Calculate metrics
  const metrics: DriverMetrics = useMemo(() => {
    const active = drivers.filter(d => d.status === 'active').length;
    const suspended = drivers.filter(d => d.status === 'suspended').length;
    const onBreak = drivers.filter(d => d.status === 'on-break').length;
    const offline = drivers.filter(d => d.status === 'offline').length;
    const inactive = drivers.filter(d => d.status === 'inactive').length;

    return {
      totalDrivers: drivers.length,
      activeDrivers: active,
      suspendedDrivers: suspended,
      onBreakDrivers: onBreak,
      offlineDrivers: offline,
      avgRating: drivers.length > 0 ? drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length : 0,
      totalEarningsThisMonth: drivers.reduce((sum, d) => sum + (d.earnings?.thisMonth || 0), 0),
      totalDeliveriesThisMonth: drivers.reduce((sum, d) => sum + d.totalDeliveries, 0),
      statusDistribution: {
        active: active,
        inactive: inactive,
        suspended: suspended,
        'on-break': onBreak,
        offline: offline,
      },
    };
  }, [drivers]);

  return {
    drivers: filteredDrivers,
    allDrivers: drivers,
    isLoading,
    error,
    metrics,
    fetchDrivers,
    fetchDriverById,
    updateDriverStatus,
    updateDriver,
    deleteDriver,
    createDriver,
    searchDrivers,
    getDriversByStatus,
    getDriversByVehicleType,
  };
}
