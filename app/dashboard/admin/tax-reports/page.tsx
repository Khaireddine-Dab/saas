'use client';

import { useState } from 'react';
import { Download, Trash2, Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockTaxData = Array.from({ length: 20 }, (_, i) => ({
  id: `tax-${String(i + 1).padStart(4, '0')}`,
  couponCode: `SAVE${String(i + 1).padStart(3, '0')}`,
  type: ['flat_discount', 'percentage', 'bogo', 'volume'][i % 4],
  totalUsed: Math.floor(Math.random() * 1000) + 10,
  totalDiscounted: Math.floor(Math.random() * 50000) + 1000,
  discountValue: Math.floor(Math.random() * 500) + 10,
  status: ['active', 'expired', 'paused'][i % 3],
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
  expiresAt: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
  platforms: ['web', 'app', 'both'][(i % 3) as any],
}));

export default function TaxReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const filteredData = mockTaxData.filter(item => {
    const matchesSearch = item.couponCode.includes(searchQuery.toUpperCase());
    const matchesType = !typeFilter || item.type === typeFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalDiscount = filteredData.reduce((sum, item) => sum + item.totalDiscounted, 0);
  const totalUsage = filteredData.reduce((sum, item) => sum + item.totalUsed, 0);

  const statusColors = {
    active: 'bg-green-500/20 text-green-500 border-green-500/40',
    expired: 'bg-red-500/20 text-red-500 border-red-500/40',
    paused: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tax & Discount Reports</h1>
          <p className="text-muted-foreground">Manage and moderate discounts, coupons, and promotional offers</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Coupons</div>
          <div className="text-2xl font-bold text-foreground">{mockTaxData.length}</div>
          <div className="text-xs text-muted-foreground mt-1">All active & inactive</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Discount Given</div>
          <div className="text-2xl font-bold text-destructive">${(totalDiscount / 1000).toFixed(1)}K</div>
          <div className="text-xs text-muted-foreground mt-1">Total value distributed</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Usage</div>
          <div className="text-2xl font-bold text-primary">{totalUsage.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">Coupon redemptions</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Active Campaigns</div>
          <div className="text-2xl font-bold text-green-500">{mockTaxData.filter(d => d.status === 'active').length}</div>
          <div className="text-xs text-muted-foreground mt-1">Currently running</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 space-y-3">
        <h3 className="font-semibold">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search coupon code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
          />
          <select
            value={typeFilter || ''}
            onChange={(e) => setTypeFilter(e.target.value || undefined)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground hover:bg-muted transition-colors"
          >
            <option value="">All Types</option>
            <option value="flat_discount">Flat Discount</option>
            <option value="percentage">Percentage</option>
            <option value="bogo">BOGO (Buy One Get One)</option>
            <option value="volume">Volume Discount</option>
          </select>
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || undefined)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground hover:bg-muted transition-colors"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="paused">Paused</option>
          </select>
          <Button variant="outline">Reset Filters</Button>
        </div>
      </Card>

      {/* Tax Data Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Coupon Code</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Type</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Discount Value</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Total Discount</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Usage Count</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Created</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Expires</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-muted/50 transition-colors border-b border-border">
                  <td className="px-6 py-4 font-semibold text-foreground">{item.couponCode}</td>
                  <td className="px-6 py-4 capitalize text-sm text-muted-foreground">{item.type.replace('_', ' ')}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">${item.discountValue}</td>
                  <td className="px-6 py-4 text-destructive font-semibold">${item.totalDiscounted.toLocaleString()}</td>
                  <td className="px-6 py-4 text-primary font-semibold">{item.totalUsed}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.createdAt.toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.expiresAt.toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <Badge className={statusColors[item.status as keyof typeof statusColors]}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-blue-100 rounded text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-yellow-100 rounded text-yellow-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-red-100 rounded text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
