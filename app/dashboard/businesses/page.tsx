'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { RiskScoreBadge } from '@/components/dashboard/risk-score-badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, Plus, MapPin } from 'lucide-react';
import { formatNumber, formatDate } from '@/lib/helpers';
import { mockBusinesses } from '@/lib/mock-data';
import { Business } from '@/types/business';

export default function BusinessesPage() {
  const [sortKey, setSortKey] = useState<keyof Business>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  let filteredBusinesses = mockBusinesses.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || business.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Business, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const statusOptions = ['pending', 'approved', 'rejected', 'suspended'];
  const statusCounts = {
    pending: mockBusinesses.filter(b => b.status === 'pending').length,
    approved: mockBusinesses.filter(b => b.status === 'approved').length,
    rejected: mockBusinesses.filter(b => b.status === 'rejected').length,
    suspended: mockBusinesses.filter(b => b.status === 'suspended').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Businesses</h1>
          <p className="text-muted-foreground mt-2">Manage all marketplace businesses and vendors</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Business
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter ? 'outline' : 'default'}
            size="default"
            onClick={() => setStatusFilter(null)}
          >
            All ({mockBusinesses.length})
          </Button>
          {statusOptions.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="default"
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status as keyof typeof statusCounts]})
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Businesses</p>
          <p className="text-2xl font-bold text-foreground">{formatNumber(mockBusinesses.length)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Avg Rating</p>
          <p className="text-2xl font-bold text-foreground">
            {(mockBusinesses.reduce((sum, b) => sum + b.averageRating, 0) / mockBusinesses.length).toFixed(1)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Products</p>
          <p className="text-2xl font-bold text-foreground">
            {formatNumber(mockBusinesses.reduce((sum, b) => sum + b.totalProducts, 0))}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
        </div>
      </div>

      {/* Table */}
      <DataTable<Business>
        columns={[
          {
            key: 'name',
            label: 'Business Name',
            sortable: true,
            render: (value, row) => (
              <div>
                <p className="font-medium text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{row.ownerName}</p>
              </div>
            ),
          },
          {
            key: 'category',
            label: 'Category',
            sortable: true,
          },
          {
            key: 'address',
            label: 'Location',
            sortable: false,
            render: (value, row) => (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{row.city}</span>
              </div>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value) => <StatusBadge status={value} />,
          },
          {
            key: 'riskScore',
            label: 'Risk Score',
            sortable: true,
            render: (value, row) => <RiskScoreBadge score={value} level={row.riskLevel} />,
          },
          {
            key: 'averageRating',
            label: 'Rating',
            sortable: true,
            render: (value, row) => (
              <div>
                <p className="font-medium text-foreground">{value.toFixed(1)} ⭐</p>
                <p className="text-xs text-muted-foreground">{row.totalReviews} reviews</p>
              </div>
            ),
          },
          {
            key: 'createdAt',
            label: 'Joined',
            sortable: true,
            render: (value) => formatDate(value),
          },
        ]}
        data={sortedBusinesses}
        onSort={handleSort}
        sortKey={sortKey}
        sortDirection={sortDirection}
      />
    </div>
  );
}
