'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { RiskScoreBadge } from '@/components/dashboard/risk-score-badge';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { formatDate } from '@/lib/helpers';
import { mockReviews } from '@/lib/mock-data';
import { Review } from '@/types/review';

export default function ReviewsPage() {
  const [sortKey, setSortKey] = useState<keyof Review>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  let filteredReviews = mockReviews.filter((review) => {
    const matchesSearch =
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || review.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Review, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const statusOptions = ['visible', 'hidden', 'flagged'];
  const statusCounts = {
    visible: mockReviews.filter(r => r.status === 'visible').length,
    hidden: mockReviews.filter(r => r.status === 'hidden').length,
    flagged: mockReviews.filter(r => r.status === 'flagged').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reviews & Moderation</h1>
        <p className="text-muted-foreground mt-2">Review, monitor, and moderate user reviews and feedback</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reviews..."
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
            All ({mockReviews.length})
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
          <p className="text-sm text-muted-foreground">Total Reviews</p>
          <p className="text-2xl font-bold text-foreground">{mockReviews.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Flagged</p>
          <p className="text-2xl font-bold text-red-600">{mockReviews.filter(r => r.flagged).length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Avg Rating</p>
          <p className="text-2xl font-bold text-foreground">
            {(mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length).toFixed(1)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">High Risk</p>
          <p className="text-2xl font-bold text-orange-600">
            {mockReviews.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable<Review>
        columns={[
          {
            key: 'title',
            label: 'Review',
            sortable: true,
            render: (value, row) => (
              <div>
                <p className="font-medium text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground truncate">{row.content}</p>
              </div>
            ),
          },
          {
            key: 'userName',
            label: 'Author',
            sortable: true,
            render: (value, row) => (
              <div>
                <p className="text-sm text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{row.verified ? '✓ Verified' : 'Unverified'}</p>
              </div>
            ),
          },
          {
            key: 'productName',
            label: 'Product',
            sortable: true,
            render: (value, row) => (
              <div>
                <p className="text-sm text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{row.businessName}</p>
              </div>
            ),
          },
          {
            key: 'rating',
            label: 'Rating',
            sortable: true,
            render: (value) => <span className="font-bold">{value} ⭐</span>,
          },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value) => <StatusBadge status={value} />,
          },
          {
            key: 'spamScore',
            label: 'Spam Risk',
            sortable: true,
            render: (value, row) => <RiskScoreBadge score={value} level={row.riskLevel} />,
          },
          {
            key: 'flagCount',
            label: 'Flags',
            sortable: true,
            render: (value) => (
              <span className={value > 0 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                {value}
              </span>
            ),
          },
          {
            key: 'createdAt',
            label: 'Date',
            sortable: true,
            render: (value) => formatDate(value),
          },
        ]}
        data={sortedReviews}
        onSort={handleSort}
        sortKey={sortKey}
        sortDirection={sortDirection}
      />
    </div>
  );
}
