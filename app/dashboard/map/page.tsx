'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { DataTable } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { mockBusinesses } from '@/lib/mock-moderation-data';
import { Business } from '@/types/business';

// Note: Leaflet integration is prepared here
// TODO: Connect to Leaflet map library for interactive mapping
// Install: npm install react-leaflet leaflet
// Use <MapContainer>, <TileLayer>, and <Marker> components

export default function MapPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  const filteredBusinesses = mockBusinesses.filter((business) =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Map & Location Management</h1>
        <p className="text-muted-foreground mt-2">Manage business locations and geographic data</p>
      </div>

      {/* Main Content - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Business List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredBusinesses.map((business) => (
              <button
                key={business.id}
                onClick={() => setSelectedBusiness(business)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${selectedBusiness?.id === business.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:border-muted'
                  }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{business.name}</p>
                    <p className="text-xs opacity-75 truncate">{business.address}</p>
                  </div>
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right - Map Area */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {selectedBusiness
                  ? `${selectedBusiness.name} - Lat: ${selectedBusiness.location.latitude.toFixed(4)}, Lon: ${selectedBusiness.location.longitude.toFixed(4)}`
                  : 'Select a business to view location'}
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                TODO: Interactive Leaflet map will be displayed here with business markers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Business Details */}
      {selectedBusiness && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Business Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium text-foreground">{selectedBusiness.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Owner</p>
              <p className="font-medium text-foreground">{selectedBusiness.ownerName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium text-foreground">
                {selectedBusiness.latitude}, {selectedBusiness.longitude}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium text-foreground">{selectedBusiness.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <StatusBadge status={selectedBusiness.status} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Risk Score</p>
              <p className="font-medium text-foreground">{selectedBusiness.riskScore}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button>Edit Location</Button>
            <Button variant="outline">Check Duplicates</Button>
            <Button variant="outline">Merge Businesses</Button>
          </div>
        </div>
      )}

      {/* Business Locations Table */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">All Business Locations</h3>
        <DataTable<Business>
          columns={[
            {
              key: 'name',
              label: 'Business Name',
              sortable: true,
            },
            {
              key: 'city',
              label: 'City',
              sortable: true,
            },
            {
              key: 'address',
              label: 'Address',
              sortable: true,
            },
            {
              key: 'status',
              label: 'Status',
              render: (value) => <StatusBadge status={value} />,
            },
          ]}
          data={mockBusinesses}
        />
      </div>
    </div>
  );
}
