'use client';

import { useState } from 'react';
import { Download, Filter, Plus, Search, Tag, X } from 'lucide-react';
import { useCoupons } from '@/hooks/useCoupons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CouponStatus } from '@/types/coupon';

interface CouponFormData {
  code: string;
  discountType: 'percentage' | 'fixed' | 'bogo';
  discountValue: number;
  perDayLimit: number;
  useLimit: number;
  minimumAmount: number;
  startDate: string;
  endDate: string;
  categories: string[];
  description: string;
  isPrivate: boolean;
}

const statusColors: Record<CouponStatus, string> = {
  active: 'bg-green-500/20 text-green-500 border-green-500/40',
  inactive: 'bg-muted text-muted-foreground border-border/50',
  expired: 'bg-red-500/20 text-red-500 border-red-500/40',
  scheduled: 'bg-primary/20 text-primary border-primary/40',
};

export default function CouponsPage() {
  const [statusFilter, setStatusFilter] = useState<CouponStatus | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    perDayLimit: 0,
    useLimit: 0,
    minimumAmount: 0,
    startDate: '',
    endDate: '',
    categories: [],
    description: '',
    isPrivate: false,
  });
  const { coupons, statistics } = useCoupons({ status: statusFilter, search: searchQuery });

  const handleCreateCoupon = () => {
    console.log('[v0] Creating coupon:', formData);
    setShowCreateModal(false);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      perDayLimit: 0,
      useLimit: 0,
      minimumAmount: 0,
      startDate: '',
      endDate: '',
      categories: [],
      description: '',
      isPrivate: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coupon Management</h1>
          <p className="text-muted-foreground">Create and manage discount codes for your marketplace</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Coupons</div>
          <div className="text-2xl font-bold text-foreground">{statistics.totalCoupons}</div>
          <div className="text-xs text-muted-foreground mt-1">All coupons</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-bold text-green-500">{statistics.activeCoupons}</div>
          <div className="text-xs text-muted-foreground mt-1">Currently active</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Usages</div>
          <div className="text-2xl font-bold text-foreground">{statistics.totalUsages}</div>
          <div className="text-xs text-muted-foreground mt-1">Times redeemed</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Discount Given</div>
          <div className="text-2xl font-bold text-foreground">${(statistics.totalDiscountGiven / 1000).toFixed(1)}K</div>
          <div className="text-xs text-muted-foreground mt-1">Total value</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by coupon code or description..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter || ''}
              onChange={e => setStatusFilter(e.target.value as CouponStatus || undefined)}
              className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground hover:bg-muted transition-colors"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
              <option value="scheduled">Scheduled</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Coupons Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Discount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Usage</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Dates</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length > 0 ? (
                coupons.slice(0, 10).map(coupon => (
                  <tr key={coupon.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono font-semibold text-foreground">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{coupon.description}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="text-foreground font-medium">{coupon.currentUses}</span>
                      <span className="text-muted-foreground"> / {coupon.maxUses}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {coupon.startDate.toLocaleDateString()} - {coupon.endDate.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={statusColors[coupon.status]}>
                        {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No coupons found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-xl font-bold text-foreground">Create New Coupon</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Coupon Code</label>
                  <Input
                    placeholder="e.g., SAVE20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-foreground">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                    <option value="bogo">Buy One Get One</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Discount Value</label>
                  <Input
                    type="number"
                    placeholder="Enter value"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                  />
                </div>

                {/* Per Day Limit */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Per Day Limit</label>
                  <Input
                    type="number"
                    placeholder="0 for unlimited"
                    value={formData.perDayLimit}
                    onChange={(e) => setFormData({ ...formData, perDayLimit: parseInt(e.target.value) })}
                  />
                </div>

                {/* Use Limit */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Total Use Limit</label>
                  <Input
                    type="number"
                    placeholder="0 for unlimited"
                    value={formData.useLimit}
                    onChange={(e) => setFormData({ ...formData, useLimit: parseInt(e.target.value) })}
                  />
                </div>

                {/* Minimum Amount */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Minimum Amount to Apply</label>
                  <Input
                    type="number"
                    placeholder="Minimum order value"
                    value={formData.minimumAmount}
                    onChange={(e) => setFormData({ ...formData, minimumAmount: parseFloat(e.target.value) })}
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Start Date</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-semibold mb-1">End Date</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2">Select Categories (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {['Electronics', 'Fashion', 'Groceries', 'Home', 'Sports'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        const updated = formData.categories.includes(cat)
                          ? formData.categories.filter((c) => c !== cat)
                          : [...formData.categories, cat];
                        setFormData({ ...formData, categories: updated });
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition ${formData.categories.includes(cat)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-foreground">Description</label>
                <textarea
                  placeholder="Enter coupon description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground h-20 resize-none focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Private Coupon Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={formData.isPrivate}
                  onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isPrivate" className="text-sm font-medium">
                  Private Coupon (only for specific merchants)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateCoupon}>
                  Create Coupon
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
