'use client';

import { useState } from 'react';
import { ChevronDown, Download, Filter, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderScheduleCard } from '@/components/admin/order-schedule-card';
import type { OrderStatus } from '@/types/order';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
  approved: 'bg-primary/20 text-primary border-primary/40',
  processing: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
  shipped: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
  delivered: 'bg-green-500/20 text-green-500 border-green-500/40',
  cancelled: 'bg-red-500/20 text-red-500 border-red-500/40',
  refunded: 'bg-orange-500/20 text-orange-500 border-orange-500/40',
};

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
  paid: 'bg-green-500/20 text-green-500 border-green-500/40',
  failed: 'bg-red-500/20 text-red-500 border-red-500/40',
  refunded: 'bg-orange-500/20 text-orange-500 border-orange-500/40',
};

type ViewMode = 'list' | 'schedule';
type ScheduleStatus = 'pending' | 'accepted' | 'ongoing' | 'cancelled' | 'completed' | 'recurring';

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [scheduleTab, setScheduleTab] = useState<ScheduleStatus>('pending');
  const { orders, metrics } = useOrders({ status: statusFilter });

  const filteredOrders = orders.filter(order =>
    order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Schedule/Recurring orders mock data
  const scheduleOrders = {
    pending: [
      { id: '10', merchant: 'Fashion Trends', category: 'Ecommerce', price: 55.99, time: '16:51 Feb 4, 2025' },
      { id: '9', merchant: 'Beauty Glow', category: 'Ecommerce', price: 55.99, time: '16:45 Feb 4, 2025' },
      { id: '8', merchant: 'Fashion Trends', category: 'Ecommerce', price: 55.99, time: '19:05 Jan 30, 2025' },
    ],
    accepted: [
      { id: '5', merchant: 'Shopify Store', category: 'Retail', price: 89.99, time: '14:20 Feb 1, 2025' },
      { id: '4', merchant: 'Tech Hub', category: 'Electronics', price: 199.99, time: '10:15 Jan 28, 2025' },
      { id: '3', merchant: 'Fashion Forward', category: 'Clothing', price: 45.50, time: '18:30 Jan 25, 2025' },
      { id: '2', merchant: 'Beauty Plus', category: 'Cosmetics', price: 35.99, time: '12:00 Jan 22, 2025' },
      { id: '1', merchant: 'Grocery Store', category: 'Food', price: 25.50, time: '09:45 Jan 20, 2025' },
    ],
    ongoing: [],
    cancelled: [
      { id: '14', merchant: 'Clothing Co', category: 'Fashion', price: 65.99, time: '17:30 Feb 2, 2025' },
      { id: '13', merchant: 'Electronics Plus', category: 'Tech', price: 150.00, time: '11:20 Jan 31, 2025' },
    ],
    completed: [
      { id: '12', merchant: 'Coffee Shop', category: 'Food & Beverage', price: 15.99, time: '08:30 Feb 3, 2025' },
      { id: '11', merchant: 'Bookstore', category: 'Books', price: 32.50, time: '14:00 Feb 1, 2025' },
      { id: '7', merchant: 'Pharmacy', category: 'Healthcare', price: 28.99, time: '16:45 Jan 27, 2025' },
    ],
    recurring: [
      { id: '20', merchant: 'Weekly Groceries', category: 'Grocery', price: 95.50, time: 'Every Monday 10:00 AM' },
      { id: '19', merchant: 'Coffee Subscription', category: 'Food', price: 12.99, time: 'Daily 07:00 AM' },
      { id: '18', merchant: 'Meal Prep Delivery', category: 'Food', price: 49.99, time: 'Every Wednesday 6:00 PM' },
    ],
  };

  const currentTabOrders = scheduleOrders[scheduleTab] || [];

  const handleAcceptSchedule = (orderId: string) => {
    console.log('[v0] Accept schedule order:', orderId);
  };

  const handleCancelSchedule = (orderId: string) => {
    console.log('[v0] Cancel schedule order:', orderId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground">Manage and track all marketplace orders</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
          <Button
            variant={viewMode === 'schedule' ? 'default' : 'outline'}
            onClick={() => setViewMode('schedule')}
          >
            Schedule/Recurring
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Orders</div>
          <div className="text-2xl font-bold text-foreground">{metrics.totalOrders}</div>
          <div className="text-xs text-muted-foreground mt-1">All time</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Pending</div>
          <div className="text-2xl font-bold text-yellow-500">{metrics.pendingOrders}</div>
          <div className="text-xs text-muted-foreground mt-1">Awaiting approval</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg Order Value</div>
          <div className="text-2xl font-bold text-foreground">${metrics.avgOrderValue.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground mt-1">Per transaction</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Revenue</div>
          <div className="text-2xl font-bold text-green-500">${(metrics.totalRevenue / 1000).toFixed(1)}K</div>
          <div className="text-xs text-muted-foreground mt-1">All orders</div>
        </Card>
      </div>

      {/* Render based on view mode */}
      {viewMode === 'list' ? (
        <>
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID or customer name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter || ''}
                  onChange={e => setStatusFilter(e.target.value as OrderStatus || undefined)}
                  className="px-3 py-2 rounded-lg border border-border text-sm bg-muted text-foreground hover:border-primary"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Orders Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Seller</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.slice(0, 10).map(order => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/40">
                        <td className="px-4 py-3 font-medium text-foreground">{order.orderId}</td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-foreground">{order.userName}</div>
                          <div className="text-xs text-muted-foreground">{order.userEmail}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{order.businessName}</td>
                        <td className="px-4 py-3 font-medium text-foreground text-right">${order.totalAmount.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <Badge className={statusColors[order.status]}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={paymentStatusColors[order.paymentStatus] || 'bg-muted'}>
                            {order.paymentStatus}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {order.createdAt.toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <div className="space-y-6">
          {/* Schedule/Recurring Orders */}
          <div className="space-y-4">
            {/* Status Tabs */}
            <div className="flex items-center justify-between overflow-x-auto pb-2">
              <div className="flex gap-2">
                {(['pending', 'accepted', 'ongoing', 'cancelled', 'completed', 'recurring'] as ScheduleStatus[]).map((tab) => {
                  const tabCounts: Record<ScheduleStatus, number> = {
                    pending: 3,
                    accepted: 5,
                    ongoing: 0,
                    cancelled: 2,
                    completed: 3,
                    recurring: 3,
                  };
                  return (
                    <Button
                      key={tab}
                      onClick={() => setScheduleTab(tab)}
                      className={`whitespace-nowrap rounded-lg ${scheduleTab === tab
                          ? tab === 'recurring'
                            ? 'bg-foreground text-background'
                            : 'bg-destructive text-destructive-foreground'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                        }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tabCounts[tab]})
                    </Button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Schedule Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentTabOrders.map((order: any) => (
                <OrderScheduleCard
                  key={order.id}
                  orderId={order.id}
                  merchantName={order.merchant}
                  category={order.category}
                  price={order.price}
                  currency="USD"
                  scheduledTime={order.time}
                  status={scheduleTab === 'recurring' ? 'accepted' : (scheduleTab as any)}
                  onAccept={() => handleAcceptSchedule(order.id)}
                  onCancel={() => handleCancelSchedule(order.id)}
                  onSchedule={() => console.log('Schedule order:', order.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
