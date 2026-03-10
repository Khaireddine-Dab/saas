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
import { Plus, Edit2, Trash2, Truck } from 'lucide-react';

interface Vehicle {
  id: string;
  type: 'motorcycle' | 'car' | 'van' | 'truck';
  name: string;
  capacity: number;
  baseDeliveryFee: number;
  perKmRate: number;
  minOrder: number;
  maxOrderValue: number;
  status: 'active' | 'inactive';
  deliveryTime: string;
  serviceAreas: string[];
  createdAt: Date;
}

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    type: 'motorcycle',
    name: 'Motorcycle Express',
    capacity: 5,
    baseDeliveryFee: 2.5,
    perKmRate: 0.5,
    minOrder: 10,
    maxOrderValue: 500,
    status: 'active',
    deliveryTime: '15-30 mins',
    serviceAreas: ['Downtown', 'Business District'],
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    type: 'car',
    name: 'Car Delivery',
    capacity: 15,
    baseDeliveryFee: 4.0,
    perKmRate: 0.8,
    minOrder: 25,
    maxOrderValue: 2000,
    status: 'active',
    deliveryTime: '20-40 mins',
    serviceAreas: ['Downtown', 'Business District', 'Suburban'],
    createdAt: new Date('2023-01-05'),
  },
  {
    id: '3',
    type: 'van',
    name: 'Van Delivery',
    capacity: 30,
    baseDeliveryFee: 6.0,
    perKmRate: 1.2,
    minOrder: 50,
    maxOrderValue: 5000,
    status: 'active',
    deliveryTime: '30-60 mins',
    serviceAreas: ['Downtown', 'Business District', 'Suburban', 'Outskirts'],
    createdAt: new Date('2023-01-10'),
  },
  {
    id: '4',
    type: 'truck',
    name: 'Truck Bulk Delivery',
    capacity: 100,
    baseDeliveryFee: 10.0,
    perKmRate: 1.8,
    minOrder: 200,
    maxOrderValue: 20000,
    status: 'inactive',
    deliveryTime: '45-90 mins',
    serviceAreas: ['All Areas'],
    createdAt: new Date('2023-02-01'),
  },
];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter((v) => v.status === 'active').length,
    avgCapacity:
      vehicles.reduce((sum, v) => sum + v.capacity, 0) / vehicles.length,
    totalArea: new Set(vehicles.flatMap((v) => v.serviceAreas)).size,
  };

  const vehicleTypeEmojis = {
    motorcycle: '🏍️',
    car: '🚗',
    van: '🚐',
    truck: '🚚',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vehicle Management</h1>
          <p className="text-muted-foreground">Configure delivery vehicle types and pricing</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle Type
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Vehicles</div>
          <div className="text-2xl font-bold text-foreground">{stats.totalVehicles}</div>
          <div className="text-xs text-muted-foreground mt-1">{stats.activeVehicles} active</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg Capacity</div>
          <div className="text-2xl font-bold text-foreground">{stats.avgCapacity.toFixed(0)} units</div>
          <div className="text-xs text-muted-foreground mt-1">Per delivery</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Service Areas</div>
          <div className="text-2xl font-bold text-foreground">{stats.totalArea}</div>
          <div className="text-xs text-muted-foreground mt-1">Coverage zones</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg Base Fee</div>
          <div className="text-2xl font-bold text-foreground">
            ${(vehicles.reduce((sum, v) => sum + v.baseDeliveryFee, 0) / vehicles.length).toFixed(1)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Per order</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search vehicles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVehicles.length === 0 ? (
          <Card className="col-span-full p-8 text-center">
            <p className="text-muted-foreground">No vehicles found</p>
          </Card>
        ) : (
          filteredVehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className={`p-6 ${vehicle.status === 'inactive' ? 'opacity-60' : ''}`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{vehicleTypeEmojis[vehicle.type]}</span>
                    <div>
                      <h3 className="font-semibold text-foreground">{vehicle.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      vehicle.status === 'active'
                        ? 'bg-green-500/20 text-green-500 border-green-500/40'
                        : 'bg-muted text-muted-foreground border-border'
                    }
                  >
                    {vehicle.status}
                  </Badge>
                </div>

                {/* Pricing Info */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-muted rounded-lg border border-border">
                  <div>
                    <div className="text-xs text-muted-foreground">Base Fee</div>
                    <div className="font-semibold text-foreground">${vehicle.baseDeliveryFee}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Per KM</div>
                    <div className="font-semibold text-foreground">${vehicle.perKmRate}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Min Order</div>
                    <div className="font-semibold text-foreground">${vehicle.minOrder}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Max Value</div>
                    <div className="font-semibold text-foreground">${vehicle.maxOrderValue}</div>
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Capacity</div>
                    <div className="font-medium text-foreground">{vehicle.capacity} units</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Delivery Time</div>
                    <div className="font-medium text-foreground">{vehicle.deliveryTime}</div>
                  </div>
                </div>

                {/* Service Areas */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Service Areas</div>
                  <div className="flex flex-wrap gap-1">
                    {vehicle.serviceAreas.map((area) => (
                      <Badge key={area} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-border">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
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
