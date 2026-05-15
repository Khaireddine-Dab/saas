'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTransactions } from '@/hooks/useTransactions';
import { FrontendTransaction } from '@/lib/transaction-mapper';

const statusColors: Record<string, string> = {
  completed: 'bg-green-500/20 text-green-500 border-green-500/40',
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
  failed: 'bg-red-500/20 text-red-500 border-red-500/40',
  processing: 'bg-blue-500/20 text-blue-500 border-blue-500/40',
};

const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtTime = (d: Date) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const PAGE_SIZE = 10;

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string };
function FilterSelect({ label, children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      {label && <label className="text-xs font-medium text-muted-foreground px-0.5">{label}</label>}
      <select
        {...props}
        className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
      >
        {children}
      </select>
    </div>
  );
}

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [gatewayFilter, setGatewayFilter] = useState('');
  const [merchantFilter, setMerchantFilter] = useState('');
  const [filterType, setFilterType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [isClient, setIsClient] = useState(false);

  // Fetch transactions from API
  const { transactions, stats, loading, error } = useTransactions({
    status: statusFilter || undefined,
    type: filterType || undefined,
    merchant_id: merchantFilter ? parseInt(merchantFilter) : undefined,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredTransactions = useMemo(() => {
    // Apply client-side filtering for search and date range
    return transactions.filter(txn => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        txn.id.toLowerCase().includes(q) ||
        txn.orderNumber.toLowerCase().includes(q) ||
        txn.customerName.toLowerCase().includes(q) ||
        txn.merchantName.toLowerCase().includes(q) ||
        txn.merchantNumber.toLowerCase().includes(q) ||
        (txn.driverName?.toLowerCase().includes(q) || false) ||
        txn.dropLocation.toLowerCase().includes(q);
      const matchesGateway = !gatewayFilter || txn.gateway === gatewayFilter;
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate + 'T23:59:59') : null;
      const inDateRange = (!start || txn.date >= start) && (!end || txn.date <= end);
      return matchesSearch && matchesGateway && inDateRange;
    });
  }, [transactions, searchQuery, gatewayFilter, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const paginated = filteredTransactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalRevenue = filteredTransactions.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const totalFees = filteredTransactions.filter(t => t.status === 'completed').reduce((s, t) => s + t.fee, 0);
  const hasActiveFilters = statusFilter || gatewayFilter || merchantFilter || filterType || startDate || endDate || searchQuery;

  const clearFilters = () => {
    setStatusFilter(''); setGatewayFilter(''); setMerchantFilter('');
    setFilterType(''); setStartDate(''); setEndDate('');
    setSearchQuery(''); setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Transactions</h1>
          <p className="text-muted-foreground text-sm">Track all financial transactions</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Transactions',
            value: loading ? '...' : filteredTransactions.length,
            sub: 'Matching filters',
            color: 'text-foreground',
          },
          {
            label: 'Completed Revenue',
            value: loading ? '...' : `$${(totalRevenue / 1000).toFixed(1)}K`,
            sub: `${filteredTransactions.filter(t => t.status === 'completed').length} orders`,
            color: 'text-green-500',
          },
          {
            label: 'Failed Transactions',
            value: loading ? '...' : filteredTransactions.filter(t => t.status === 'failed').length,
            sub: 'Needs review',
            color: 'text-red-500',
          },
          {
            label: 'Total Fees',
            value: loading ? '...' : `$${(totalFees / 1000).toFixed(1)}K`,
            sub: 'Gateway fees',
            color: 'text-foreground',
          },
        ].map(({ label, value, sub, color }) => (
          <Card key={label} className="p-4">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{sub}</div>
          </Card>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <Card className="p-4 border-red-500/30 bg-red-500/5">
          <div className="text-sm text-red-500">
            <strong>Error:</strong> {error}
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Filters</h3>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition">
              <X className="w-3.5 h-3.5" /> Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <FilterSelect label="Merchant" value={merchantFilter} onChange={e => { setMerchantFilter(e.target.value); setPage(1); }}>
            <option value="">All Merchants</option>
            {isClient && Array.from(new Map(transactions.map(t => [t.merchantId.toString(), t.merchantName]))).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </FilterSelect>

          <FilterSelect label="Type" value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}>
            <option value="">All Types</option>
            <option value="payment">Payment</option>
            <option value="refund">Refund</option>
            <option value="wallet_topup">Wallet Topup</option>
          </FilterSelect>

          <FilterSelect label="Status" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </FilterSelect>

          <FilterSelect label="Gateway" value={gatewayFilter} onChange={e => { setGatewayFilter(e.target.value); setPage(1); }}>
            <option value="">All Gateways</option>
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
            <option value="razorpay">Razorpay</option>
            <option value="cod">Cash on Delivery</option>
            <option value="wallet">Wallet</option>
          </FilterSelect>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground px-0.5">From</label>
            <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground px-0.5">To</label>
            <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order #, transaction ID, customer, merchant, driver, location..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1800px]">
            <thead className="bg-muted border-b border-border">
              <tr>
                {[
                  'Date', 'Order #', 'Merch #', 'Merchant Name', 'Customer Name',
                  'Drop Location', 'Driver', 'Time Created', 'Time Accepted',
                  'Collection Time', 'Wait', 'Pickup Time', 'Delivery Duration',
                  'Time Delivered', 'KM', 'Amount', 'Status',
                ].map(col => (
                  <th key={col} className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={17} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    Loading transactions...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={17} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    No transactions match your filters.
                  </td>
                </tr>
              ) : paginated.map(txn => (
                <tr key={txn.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-3 py-3 whitespace-nowrap text-muted-foreground text-xs">{fmt(txn.date)}</td>
                  <td className="px-3 py-3 whitespace-nowrap font-medium text-foreground text-xs">{txn.orderNumber}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-foreground text-xs">{txn.merchantNumber}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-foreground text-xs">{txn.merchantName}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-foreground text-xs">{txn.customerName}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-foreground text-xs">{txn.dropLocation}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-foreground text-xs">{txn.driverName}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-foreground text-xs">{fmtTime(txn.timeCreated)}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-foreground text-xs">{fmtTime(txn.timeAccepted)}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-foreground text-xs">{fmtTime(txn.collectionTime)}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-foreground text-xs">{txn.waitDuration} min</td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-foreground text-xs">{fmtTime(txn.pickupTime)}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-foreground text-xs">{txn.deliveryDuration} min</td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-foreground text-xs">{fmtTime(txn.timeDelivered)}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-foreground text-xs">{txn.km} km</td>
                  <td className="px-3 py-3 whitespace-nowrap font-semibold text-foreground text-xs">${txn.amount.toFixed(2)}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <Badge className={`text-xs border capitalize ${statusColors[txn.status] || ''}`}>
                      {txn.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing {filteredTransactions.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredTransactions.length)} of {filteredTransactions.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, i, arr) => {
                if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('...');
                acc.push(p); return acc;
              }, [])
              .map((p, i) => p === '...'
                ? <span key={`e${i}`} className="px-2 text-muted-foreground text-xs">…</span>
                : <button key={p} onClick={() => setPage(p as number)}
                    className={`w-7 h-7 rounded-lg text-xs font-medium transition ${page === p ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}>
                    {p}
                  </button>
              )}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}