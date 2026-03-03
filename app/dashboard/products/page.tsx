'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, Plus } from 'lucide-react';
import { formatCurrency, formatNumber, formatDate } from '@/lib/helpers';
import { mockProducts } from '@/lib/mock-data';
import { Product } from '@/types/product';

export default function ProductsPage() {
  const [sortKey, setSortKey] = useState<keyof Product>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  let filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.businessName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || product.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Product, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const statusOptions = ['visible', 'hidden', 'flagged', 'banned'];
  const statusCounts = {
    visible: mockProducts.filter(p => p.status === 'visible').length,
    hidden: mockProducts.filter(p => p.status === 'hidden').length,
    flagged: mockProducts.filter(p => p.status === 'flagged').length,
    banned: mockProducts.filter(p => p.status === 'banned').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-2">Monitor and moderate all marketplace products</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
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
            All ({mockProducts.length})
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
          <p className="text-sm text-muted-foreground">Total Products</p>
          <p className="text-2xl font-bold text-foreground">{formatNumber(mockProducts.length)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Visible</p>
          <p className="text-2xl font-bold text-green-600">{statusCounts.visible}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Flagged</p>
          <p className="text-2xl font-bold text-red-600">{statusCounts.flagged}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Avg Rating</p>
          <p className="text-2xl font-bold text-foreground">
            {(mockProducts.reduce((sum, p) => sum + p.averageRating, 0) / mockProducts.length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable<Product>
        columns={[
          {
            key: 'name',
            label: 'Product Name',
            sortable: true,
            render: (value, row) => (
              <div>
                <p className="font-medium text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{row.businessName}</p>
              </div>
            ),
          },
          {
            key: 'category',
            label: 'Category',
            sortable: true,
          },
          {
            key: 'price',
            label: 'Price',
            sortable: true,
            render: (value, row) => formatCurrency(value, row.currency),
          },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value) => <StatusBadge status={value} />,
          },
          {
            key: 'totalReports',
            label: 'Reports',
            sortable: true,
            render: (value) => (
              <span className={value > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                {value}
              </span>
            ),
          },
          {
            key: 'averageRating',
            label: 'Rating',
            sortable: true,
            render: (value, row) => (
              <div>
                <p className="font-medium text-foreground">{value.toFixed(1)} ⭐</p>
                <p className="text-xs text-muted-foreground">{row.reviewCount} reviews</p>
              </div>
            ),
          },
          {
            key: 'createdAt',
            label: 'Created',
            sortable: true,
            render: (value) => formatDate(value),
          },
        ]}
        data={sortedProducts}
        onSort={handleSort}
        sortKey={sortKey}
        sortDirection={sortDirection}
      />
    </div>
  );
}
