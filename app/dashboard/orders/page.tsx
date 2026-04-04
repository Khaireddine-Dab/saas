'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown, Download, Filter, Search,
  ChevronLeft, ChevronRight, MoreVertical,
  Mail, RefreshCcw, X, Calendar, User, Store,
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderScheduleCard } from '@/components/admin/order-schedule-card';
import type { OrderStatus } from '@/types/order';

// ─── Status colors ────────────────────────────────────────────────────────────
const statusColors: Record<OrderStatus, string> = {
  pending:    'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
  approved:   'bg-primary/20 text-primary border-primary/40',
  processing: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
  shipped:    'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
  delivered:  'bg-green-500/20 text-green-500 border-green-500/40',
  cancelled:  'bg-red-500/20 text-red-500 border-red-500/40',
  refunded:   'bg-orange-500/20 text-orange-500 border-orange-500/40',
};

const paymentStatusColors: Record<string, string> = {
  pending:  'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
  paid:     'bg-green-500/20 text-green-500 border-green-500/40',
  failed:   'bg-red-500/20 text-red-500 border-red-500/40',
  refunded: 'bg-orange-500/20 text-orange-500 border-orange-500/40',
};

type ViewMode       = 'list' | 'schedule';
type ScheduleStatus = 'pending' | 'accepted' | 'ongoing' | 'cancelled' | 'completed' | 'recurring';

// ─── Three-dot action menu ────────────────────────────────────────────────────
function ActionMenu({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const actions = [
    { icon: Mail,        label: 'Contact Customer', color: 'text-blue-400',   onClick: () => console.log('Contact customer for order', orderId) },
    { icon: Store,       label: 'Contact Seller',   color: 'text-indigo-400', onClick: () => console.log('Contact seller for order', orderId) },
    { icon: RefreshCcw,  label: 'Issue Refund',      color: 'text-red-400',    onClick: () => console.log('Issue refund for order', orderId) },
  ];

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
          open ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 bg-popover border border-border rounded-xl shadow-lg shadow-black/10 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {actions.map(({ icon: Icon, label, color, onClick }) => (
            <button
              key={label}
              onClick={e => { e.stopPropagation(); onClick(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-accent transition-colors text-left"
            >
              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${color}`} />
              <span className="text-foreground">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [statusFilter,   setStatusFilter]   = useState<OrderStatus | undefined>();
  const [searchQuery,    setSearchQuery]    = useState('');
  const [viewMode,       setViewMode]       = useState<ViewMode>('list');
  const [scheduleTab,    setScheduleTab]    = useState<ScheduleStatus>('pending');
  const [showFilters,    setShowFilters]    = useState(false);

  // Advanced filters
  const [customerFilter, setCustomerFilter] = useState('');
  const [sellerFilter,   setSellerFilter]   = useState('');
  const [dateFrom,       setDateFrom]       = useState('');
  const [dateTo,         setDateTo]         = useState('');

  const { orders, metrics } = useOrders({ status: statusFilter });

  // Unique values for datalist suggestions
  const uniqueCustomers = [...new Set(orders.map(o => o.userName))].sort();
  const uniqueSellers   = [...new Set(orders.map(o => o.businessName))].sort();

  const activeFilterCount = [
    customerFilter, sellerFilter, dateFrom, dateTo, statusFilter,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setCustomerFilter('');
    setSellerFilter('');
    setDateFrom('');
    setDateTo('');
    setStatusFilter(undefined);
    setSearchQuery('');
  };

  const filteredOrders = orders.filter(order => {
    const q = searchQuery.toLowerCase();

    const matchSearch = !q ||
      order.orderId.toLowerCase().includes(q) ||
      order.userName.toLowerCase().includes(q) ||
      order.businessName.toLowerCase().includes(q);

    const matchCustomer = !customerFilter ||
      order.userName.toLowerCase().includes(customerFilter.toLowerCase());

    const matchSeller = !sellerFilter ||
      order.businessName.toLowerCase().includes(sellerFilter.toLowerCase());

    const orderDate = order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt);
    const matchDateFrom = !dateFrom || orderDate >= new Date(dateFrom);
    const matchDateTo   = !dateTo   || orderDate <= new Date(dateTo + 'T23:59:59');

    return matchSearch && matchCustomer && matchSeller && matchDateFrom && matchDateTo;
  });

  // Schedule mock data
  const scheduleOrders = {
    pending:   [
      { id: '10', merchant: 'Fashion Trends', category: 'Ecommerce',      price: 55.99, time: '16:51 Feb 4, 2025' },
      { id: '9',  merchant: 'Beauty Glow',    category: 'Ecommerce',      price: 55.99, time: '16:45 Feb 4, 2025' },
      { id: '8',  merchant: 'Fashion Trends', category: 'Ecommerce',      price: 55.99, time: '19:05 Jan 30, 2025' },
    ],
    accepted:  [
      { id: '5', merchant: 'Shopify Store',    category: 'Retail',        price: 89.99,  time: '14:20 Feb 1, 2025' },
      { id: '4', merchant: 'Tech Hub',         category: 'Electronics',   price: 199.99, time: '10:15 Jan 28, 2025' },
      { id: '3', merchant: 'Fashion Forward',  category: 'Clothing',      price: 45.50,  time: '18:30 Jan 25, 2025' },
      { id: '2', merchant: 'Beauty Plus',      category: 'Cosmetics',     price: 35.99,  time: '12:00 Jan 22, 2025' },
      { id: '1', merchant: 'Grocery Store',    category: 'Food',          price: 25.50,  time: '09:45 Jan 20, 2025' },
    ],
    ongoing:   [],
    cancelled: [
      { id: '14', merchant: 'Clothing Co',     category: 'Fashion',       price: 65.99,  time: '17:30 Feb 2, 2025' },
      { id: '13', merchant: 'Electronics Plus',category: 'Tech',          price: 150.00, time: '11:20 Jan 31, 2025' },
    ],
    completed: [
      { id: '12', merchant: 'Coffee Shop',     category: 'Food & Bev',    price: 15.99,  time: '08:30 Feb 3, 2025' },
      { id: '11', merchant: 'Bookstore',       category: 'Books',         price: 32.50,  time: '14:00 Feb 1, 2025' },
      { id: '7',  merchant: 'Pharmacy',        category: 'Healthcare',    price: 28.99,  time: '16:45 Jan 27, 2025' },
    ],
    recurring: [
      { id: '20', merchant: 'Weekly Groceries',   category: 'Grocery', price: 95.50, time: 'Every Monday 10:00 AM' },
      { id: '19', merchant: 'Coffee Subscription',category: 'Food',    price: 12.99, time: 'Daily 07:00 AM' },
      { id: '18', merchant: 'Meal Prep Delivery', category: 'Food',    price: 49.99, time: 'Every Wednesday 6:00 PM' },
    ],
  };

  const tabCounts: Record<ScheduleStatus, number> = {
    pending: 3, accepted: 5, ongoing: 0, cancelled: 2, completed: 3, recurring: 3,
  };

  const currentTabOrders = scheduleOrders[scheduleTab] ?? [];

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage and track all marketplace orders</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
          <Button
            variant={viewMode === 'schedule' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('schedule')}
          >
            Schedule / Recurring
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders',    value: metrics.totalOrders,                   color: 'text-foreground',  sub: 'All time' },
          { label: 'Pending',         value: metrics.pendingOrders,                 color: 'text-yellow-500',  sub: 'Awaiting approval' },
          { label: 'Avg Order Value', value: `$${metrics.avgOrderValue.toFixed(2)}`,color: 'text-foreground',  sub: 'Per transaction' },
          { label: 'Total Revenue',   value: `$${(metrics.totalRevenue/1000).toFixed(1)}K`, color: 'text-green-500', sub: 'All orders' },
        ].map(({ label, value, color, sub }) => (
          <Card key={label} className="p-4">
            <div className="text-xs text-muted-foreground font-medium">{label}</div>
            <div className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>
          </Card>
        ))}
      </div>

      {/* ── List view ── */}
      {viewMode === 'list' && (
        <>
          {/* Search + filter bar */}
          <Card className="p-4 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID, customer or seller…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter || ''}
                onChange={e => setStatusFilter(e.target.value as OrderStatus || undefined)}
                className="px-3 py-2 rounded-lg border border-border text-sm bg-muted text-foreground hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Toggle advanced filters */}
              <button
                onClick={() => setShowFilters(s => !s)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Clear all */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear all
                </button>
              )}
            </div>

            {/* Advanced filter panel */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-border animate-in fade-in slide-in-from-top-1 duration-150">

                {/* Customer */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Customer
                  </label>
                  <div className="relative">
                    <input
                      list="customers-list"
                      placeholder="Filter by customer…"
                      value={customerFilter}
                      onChange={e => setCustomerFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition"
                    />
                    {customerFilter && (
                      <button onClick={() => setCustomerFilter('')} className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <datalist id="customers-list">
                    {uniqueCustomers.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>

                {/* Seller */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5" /> Seller
                  </label>
                  <div className="relative">
                    <input
                      list="sellers-list"
                      placeholder="Filter by seller…"
                      value={sellerFilter}
                      onChange={e => setSellerFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition"
                    />
                    {sellerFilter && (
                      <button onClick={() => setSellerFilter('')} className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <datalist id="sellers-list">
                    {uniqueSellers.map(s => <option key={s} value={s} />)}
                  </datalist>
                </div>

                {/* Date from */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> From
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition"
                  />
                </div>

                {/* Date to */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> To
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition"
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Active filters:</span>
              {customerFilter && (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full">
                  <User className="w-3 h-3" /> {customerFilter}
                  <button onClick={() => setCustomerFilter('')} className="ml-0.5 hover:text-blue-200"><X className="w-3 h-3" /></button>
                </span>
              )}
              {sellerFilter && (
                <span className="inline-flex items-center gap-1 text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                  <Store className="w-3 h-3" /> {sellerFilter}
                  <button onClick={() => setSellerFilter('')} className="ml-0.5 hover:text-indigo-200"><X className="w-3 h-3" /></button>
                </span>
              )}
              {(dateFrom || dateTo) && (
                <span className="inline-flex items-center gap-1 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-full">
                  <Calendar className="w-3 h-3" />
                  {dateFrom || '…'} → {dateTo || '…'}
                  <button onClick={() => { setDateFrom(''); setDateTo(''); }} className="ml-0.5 hover:text-purple-200"><X className="w-3 h-3" /></button>
                </span>
              )}
              {statusFilter && (
                <span className="inline-flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded-full capitalize">
                  {statusFilter}
                  <button onClick={() => setStatusFilter(undefined)} className="ml-0.5 hover:text-yellow-200"><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Orders Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/40">
                  <tr>
                    {['Order ID','Customer','Seller','Amount','Status','Payment','Date',''].map((h, i) => (
                      <th
                        key={i}
                        className={`px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${i >= 3 && i !== 7 ? 'text-center' : i === 7 ? 'text-right w-10' : 'text-left'}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.slice(0, 10).map(order => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-sm font-medium text-foreground">
                          {order.orderId}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-medium text-foreground leading-tight">{order.userName}</p>
                          <p className="text-xs text-muted-foreground">{order.userEmail}</p>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-muted-foreground">
                          {order.businessName}
                        </td>
                        <td className="px-4 py-3.5 text-center font-semibold text-sm text-foreground">
                          ${order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <Badge className={statusColors[order.status]}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <Badge className={paymentStatusColors[order.paymentStatus] ?? 'bg-muted'}>
                            {order.paymentStatus}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-muted-foreground whitespace-nowrap">
                          {(order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt)).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3.5">
                          <ActionMenu orderId={order.orderId} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center">
                        <p className="text-sm text-muted-foreground">No orders match the current filters.</p>
                        {activeFilterCount > 0 && (
                          <button onClick={clearFilters} className="mt-2 text-xs text-primary hover:text-primary/80 font-medium">
                            Clear all filters
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{Math.min(filteredOrders.length, 10)}</span> of{' '}
                <span className="font-semibold text-foreground">{filteredOrders.length}</span> orders
                {activeFilterCount > 0 && ` (filtered from ${orders.length})`}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled><ChevronLeft className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm"><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* ── Schedule / Recurring view ── */}
      {viewMode === 'schedule' && (
        <div className="space-y-4">
          {/* Status tabs */}
          <div className="flex items-center justify-between overflow-x-auto pb-1">
            <div className="flex gap-2">
              {(['pending','accepted','ongoing','cancelled','completed','recurring'] as ScheduleStatus[]).map(tab => (
                <Button
                  key={tab}
                  size="sm"
                  onClick={() => setScheduleTab(tab)}
                  className={`whitespace-nowrap rounded-lg capitalize ${
                    scheduleTab === tab
                      ? tab === 'recurring'
                        ? 'bg-foreground text-background'
                        : 'bg-destructive text-destructive-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {tab} ({tabCounts[tab]})
                </Button>
              ))}
            </div>
            <div className="flex gap-2 ml-4">
              <Button variant="outline" size="sm"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Cards grid */}
          {currentTabOrders.length > 0 ? (
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
                  onAccept={() => console.log('Accept order:', order.id)}
                  onCancel={() => console.log('Cancel order:', order.id)}
                  onSchedule={() => console.log('Schedule order:', order.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="py-16">
              <p className="text-center text-sm text-muted-foreground">No {scheduleTab} orders.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}