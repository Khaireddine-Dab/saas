'use client';

import { useState } from 'react';
import { Download, ChevronDown, Play, Pause, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockSubscriptions = Array.from({ length: 25 }, (_, i) => ({
  id: `sub-${String(i + 1).padStart(6, '0')}`,
  entityId: `entity-${String(i + 1).padStart(4, '0')}`,
  entityName: i % 2 === 0 ? `Merchant ${Math.floor(i / 2) + 1}` : `Customer ${Math.floor(i / 2) + 1}`,
  entityType: i % 2 === 0 ? 'merchant' : 'customer',
  planName: ['Basic', 'Pro', 'Enterprise', 'Premium'][i % 4],
  planId: `plan-${['basic', 'pro', 'enterprise', 'premium'][i % 4]}`,
  billingCycle: ['monthly', 'yearly', 'quarterly'][i % 3],
  amount: [9.99, 29.99, 99.99, 199.99][i % 4],
  startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
  renewalDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
  status: ['active', 'cancelled', 'paused', 'pending'][i % 4],
  paymentStatus: ['paid', 'pending', 'failed'][i % 3],
  nextBillingAmount: [9.99, 29.99, 99.99, 199.99][i % 4],
  totalSpent: Math.floor(Math.random() * 10000) + 100,
  features: Math.floor(Math.random() * 20) + 5,
}));

export default function SubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [planFilter, setPlanFilter] = useState<string | undefined>();

  const filteredSubscriptions = mockSubscriptions.filter(sub => {
    const matchesSearch = sub.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.includes(searchQuery);
    const matchesEntityType = !entityTypeFilter || sub.entityType === entityTypeFilter;
    const matchesStatus = !statusFilter || sub.status === statusFilter;
    const matchesPlan = !planFilter || sub.planName.toLowerCase() === planFilter.toLowerCase();
    return matchesSearch && matchesEntityType && matchesStatus && matchesPlan;
  });

  const activeSubscriptions = filteredSubscriptions.filter(s => s.status === 'active').length;
  const totalRecurringRevenue = filteredSubscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.amount, 0);
  const pendingPayments = filteredSubscriptions.filter(s => s.paymentStatus === 'pending').length;

  const statusColors = {
    active: 'bg-green-500/20 text-green-500 border-green-500/40',
    cancelled: 'bg-red-500/20 text-red-500 border-red-500/40',
    paused: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
    pending: 'bg-primary/20 text-primary border-primary/40',
  };

  const paymentStatusColors = {
    paid: 'bg-green-500/20 text-green-500 border-green-500/40',
    pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
    failed: 'bg-red-500/20 text-red-500 border-red-500/40',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subscription Management</h1>
          <p className="text-muted-foreground">Control merchant and platform client subscriptions</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Subscriptions</div>
          <div className="text-2xl font-bold text-foreground">{mockSubscriptions.length}</div>
          <div className="text-xs text-muted-foreground mt-1">All subscriptions</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Active Subscriptions</div>
          <div className="text-2xl font-bold text-green-500">{activeSubscriptions}</div>
          <div className="text-xs text-muted-foreground mt-1">Currently active</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Monthly Recurring Revenue</div>
          <div className="text-2xl font-bold text-primary">${totalRecurringRevenue.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground mt-1">Active plans</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Pending Payments</div>
          <div className="text-2xl font-bold text-destructive">{pendingPayments}</div>
          <div className="text-xs text-muted-foreground mt-1">Require action</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 space-y-3">
        <h3 className="font-semibold">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
          />
          <select
            value={entityTypeFilter || ''}
            onChange={(e) => setEntityTypeFilter(e.target.value || undefined)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
          >
            <option value="">All Entity Types</option>
            <option value="merchant">Merchants</option>
            <option value="customer">Customers</option>
          </select>
          <select
            value={planFilter || ''}
            onChange={(e) => setPlanFilter(e.target.value || undefined)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
          >
            <option value="">All Plans</option>
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="premium">Premium</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || undefined)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </select>
          <Button variant="outline">Reset</Button>
        </div>
      </Card>

      {/* Subscriptions Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Entity</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Type</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Plan</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Billing Cycle</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Amount</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Started</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Renewal Date</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Payment</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Total Spent</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredSubscriptions.map(sub => (
                <tr key={sub.id} className="hover:bg-muted/50 transition-colors border-b border-border">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold">{sub.entityName}</p>
                      <p className="text-xs text-muted-foreground">{sub.entityId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize text-sm">{sub.entityType}</td>
                  <td className="px-6 py-4 font-semibold">{sub.planName}</td>
                  <td className="px-6 py-4 capitalize text-sm">{sub.billingCycle}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">${sub.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{sub.startDate.toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{sub.renewalDate.toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <Badge className={statusColors[sub.status as keyof typeof statusColors]}>
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={paymentStatusColors[sub.paymentStatus as keyof typeof paymentStatusColors]}>
                      {sub.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-semibold text-primary">${sub.totalSpent.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        className="p-1 hover:bg-primary/10 rounded text-primary transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {sub.status === 'active' ? (
                        <button
                          className="p-1 hover:bg-yellow-500/10 rounded text-yellow-500 transition-colors"
                          title="Pause Subscription"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          className="p-1 hover:bg-green-500/10 rounded text-green-500 transition-colors"
                          title="Resume Subscription"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="p-1 hover:bg-destructive/10 rounded text-destructive transition-colors"
                        title="Cancel Subscription"
                      >
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

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredSubscriptions.length} of {mockSubscriptions.length} subscriptions
        </p>
        <div className="flex gap-2">
          <Button variant="outline" disabled>Previous</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  );
}
