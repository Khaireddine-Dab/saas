'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, MapPin, Star, Truck, Eye } from 'lucide-react';
import type { Driver, DriverStatus, VehicleType } from '@/types/driver';

const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Ahmed Al-Mazrouei',
    email: 'ahmed@drivers.local',
    phone: '+971501234567',
    status: 'active',
    documents: [
      { id: '1', type: 'license', status: 'verified', uploadedAt: new Date() },
      { id: '2', type: 'id', status: 'verified', uploadedAt: new Date() },
    ],
    vehicle: {
      id: 'v1',
      type: 'motorcycle',
      licensePlate: 'AD-12345',
      make: 'Honda',
      model: 'Wave',
      year: 2023,
      capacity: 5,
      status: 'active',
    },
    joinDate: new Date('2023-06-15'),
    lastActive: new Date(),
    currentLocation: {
      lat: 24.4539,
      lng: 54.3773,
      address: 'Abu Dhabi, UAE',
      updatedAt: new Date(),
    },
    totalDeliveries: 342,
    rating: 4.8,
    completionRate: 98,
    avgDeliveryTime: 28,
    averageRating: 4.8,
    acceptanceRate: 95,
    earnings: { total: 15420, thisMonth: 2840, thisWeek: 680 },
  },
  {
    id: '2',
    name: 'Fatima Al-Kaabi',
    email: 'fatima@drivers.local',
    phone: '+971502345678',
    status: 'active',
    documents: [
      { id: '3', type: 'license', status: 'verified', uploadedAt: new Date() },
      { id: '4', type: 'id', status: 'pending', uploadedAt: new Date() },
    ],
    vehicle: {
      id: 'v2',
      type: 'car',
      licensePlate: 'AD-12346',
      make: 'Toyota',
      model: 'Yaris',
      year: 2023,
      capacity: 4,
      status: 'active',
    },
    joinDate: new Date('2023-07-20'),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    currentLocation: {
      lat: 25.1972,
      lng: 55.2744,
      address: 'Dubai, UAE',
      updatedAt: new Date(),
    },
    totalDeliveries: 278,
    rating: 4.6,
    completionRate: 96,
    avgDeliveryTime: 32,
    averageRating: 4.6,
    acceptanceRate: 92,
    earnings: { total: 12890, thisMonth: 2250, thisWeek: 540 },
  },
  {
    id: '3',
    name: 'Mohammed Hassan',
    email: 'mohammed@drivers.local',
    phone: '+971503456789',
    status: 'on-break',
    documents: [
      { id: '5', type: 'license', status: 'verified', uploadedAt: new Date() },
    ],
    vehicle: {
      id: 'v3',
      type: 'van',
      licensePlate: 'AD-12347',
      make: 'Nissan',
      model: 'NV200',
      year: 2022,
      capacity: 8,
      status: 'active',
    },
    joinDate: new Date('2023-04-10'),
    lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000),
    currentLocation: {
      lat: 25.2048,
      lng: 55.2708,
      address: 'Dubai, UAE',
      updatedAt: new Date(),
    },
    totalDeliveries: 421,
    rating: 4.9,
    completionRate: 99,
    avgDeliveryTime: 25,
    averageRating: 4.9,
    acceptanceRate: 97,
    earnings: { total: 18920, thisMonth: 3420, thisWeek: 820 },
  },
];

const statusColors: Record<DriverStatus, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-yellow-100 text-yellow-800',
  'on-break': 'bg-blue-100 text-blue-800',
  offline: 'bg-red-100 text-red-800',
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DriverStatus | 'all'>('all');
  const [vehicleFilter, setVehicleFilter] = useState<VehicleType | 'all'>('all');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    const matchesVehicle =
      vehicleFilter === 'all' || driver.vehicle?.type === vehicleFilter;

    return matchesSearch && matchesStatus && matchesVehicle;
  });

  const stats = {
    totalDrivers: drivers.length,
    activeDrivers: drivers.filter((d) => d.status === 'active').length,
    avgRating: (drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1),
    totalEarnings: drivers.reduce((sum, d) => sum + d.earnings.thisWeek, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Driver Management</h1>
          <p className="text-muted-foreground">Manage and monitor all delivery drivers</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Driver
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Drivers</div>
          <div className="text-2xl font-bold text-foreground">{stats.totalDrivers}</div>
          <div className="text-xs text-muted-foreground mt-1">Registered</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Active Drivers</div>
          <div className="text-2xl font-bold text-green-600">{stats.activeDrivers}</div>
          <div className="text-xs text-muted-foreground mt-1">Currently online</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg Rating</div>
          <div className="text-2xl font-bold text-foreground">{stats.avgRating}</div>
          <div className="text-xs text-muted-foreground mt-1">Out of 5.0</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Weekly Earnings</div>
          <div className="text-2xl font-bold text-foreground">${(stats.totalEarnings / 1000).toFixed(1)}K</div>
          <div className="text-xs text-muted-foreground mt-1">This week</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search drivers by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as DriverStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="on-break">On Break</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={vehicleFilter} onValueChange={(value) => setVehicleFilter(value as VehicleType | 'all')}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by vehicle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vehicles</SelectItem>
            <SelectItem value="motorcycle">Motorcycle</SelectItem>
            <SelectItem value="car">Car</SelectItem>
            <SelectItem value="van">Van</SelectItem>
            <SelectItem value="truck">Truck</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Driver List */}
      <div className="space-y-3">
        {filteredDrivers.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No drivers found matching your criteria.</p>
          </Card>
        ) : (
          filteredDrivers.map((driver) => (
            <Card key={driver.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{driver.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Truck className="w-4 h-4" />
                        {driver.vehicle?.make} {driver.vehicle?.model} ({driver.vehicle?.licensePlate})
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    <Badge className={statusColors[driver.status]}>{driver.status}</Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {driver.rating} ({driver.totalDeliveries} deliveries)
                    </Badge>
                    <Badge variant="secondary">Completion: {driver.completionRate}%</Badge>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div>
                    <div className="text-xs text-muted-foreground">Weekly Earnings</div>
                    <div className="text-lg font-bold text-green-600">${driver.earnings.thisWeek}</div>
                  </div>
                  {driver.currentLocation && (
                    <div className="text-xs flex items-center gap-1 text-muted-foreground justify-end">
                      <MapPin className="w-3 h-3" />
                      {driver.currentLocation.address}
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedDriver(driver)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
