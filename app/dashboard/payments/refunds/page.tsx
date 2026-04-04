'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Download, Building2, User, Calendar, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockRefunds = Array.from({ length: 20 }, (_, i) => ({
  id: `ref-${String(i + 1).padStart(6, '0')}`,
  orderId: `ORD-${String(i + 1).padStart(6, '0')}`,
  customerId: `cust-${Math.floor(i / 2) + 1}`,
  customerName: ['Ahmed Ben Salah', 'Leila Mansour', 'Karim Trabelsi', 'Sonia Bouzid', 'Youssef Hadj'][i % 5],
  merchantName: ['Blue Lagoon', 'Tech Store TN', 'Maison Moderne', 'Sport Planet', 'Pharma Plus'][i % 5],
  originalAmount: Math.floor(Math.random() * 5000) + 100,
  refundAmount: Math.floor(Math.random() * 4000) + 50,
  reason: ['damaged', 'wrong_item', 'not_received', 'quality_issue'][i % 4] as any,
  status: ['pending', 'approved', 'processed', 'rejected'][i % 4] as any,
  requestedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  processedAt: i % 2 === 0 ? new Date() : null,
}));

const statusColors = {
  pending:   'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
  approved:  'bg-primary/20 text-primary border-primary/40',
  processed: 'bg-green-500/20 text-green-500 border-green-500/40',
  rejected:  'bg-destructive/20 text-destructive border-destructive/40',
};

const reasonLabel: Record<string, string> = {
  damaged:      'Damaged',
  wrong_item:   'Wrong Item',
  not_received: 'Not Received',
  quality_issue:'Quality Issue',
};

const gradients = [
  'from-indigo-500/20 to-violet-500/20 text-indigo-300',
  'from-blue-500/20 to-cyan-500/20 text-blue-300',
  'from-emerald-500/20 to-teal-500/20 text-emerald-300',
  'from-orange-500/20 to-amber-500/20 text-orange-300',
  'from-rose-500/20 to-pink-500/20 text-rose-300',
];
const getGrad = (name: string) => gradients[name.charCodeAt(0) % gradients.length];
const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

export default function RefundsPage() {
  const [searchQuery,    setSearchQuery]    = useState('');
  const [statusFilter,   setStatusFilter]   = useState<string>('');
  const [merchantFilter, setMerchantFilter] = useState<string>('');
  const [customerFilter, setCustomerFilter] = useState<string>('');
  const [dateFrom,       setDateFrom]       = useState('');
  const [dateTo,         setDateTo]         = useState('');
  const [showFilters,    setShowFilters]    = useState(false);
  const [selectedId,     setSelectedId]     = useState<string | null>(null);

  const merchants = [...new Set(mockRefunds.map(r => r.merchantName))];
  const customers = [...new Set(mockRefunds.map(r => r.customerName))];

  const activeFilterCount = [merchantFilter, customerFilter, dateFrom, dateTo, statusFilter].filter(Boolean).length;

  const filtered = mockRefunds.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchSearch   = !q || r.id.includes(q) || r.customerName.toLowerCase().includes(q) || r.merchantName.toLowerCase().includes(q);
    const matchStatus   = !statusFilter   || r.status === statusFilter;
    const matchMerchant = !merchantFilter || r.merchantName === merchantFilter;
    const matchCustomer = !customerFilter || r.customerName === customerFilter;
    const matchFrom     = !dateFrom       || r.requestedAt >= new Date(dateFrom);
    const matchTo       = !dateTo         || r.requestedAt <= new Date(dateTo + 'T23:59:59');
    return matchSearch && matchStatus && matchMerchant && matchCustomer && matchFrom && matchTo;
  });

  const totalProcessed  = filtered.filter(r => r.status === 'processed').reduce((s, r) => s + r.refundAmount, 0);
  const pendingCount    = mockRefunds.filter(r => r.status === 'pending').length;
  const avgRefund       = filtered.filter(r => r.status === 'processed');
  const avgAmt          = avgRefund.length ? avgRefund.reduce((s,r) => s + r.refundAmount, 0) / avgRefund.length : 0;
  const rejRate         = mockRefunds.length ? (mockRefunds.filter(r => r.status === 'rejected').length / mockRefunds.length * 100) : 0;

  const selected = filtered.find(r => r.id === selectedId) ?? null;

  const clearFilters = () => {
    setMerchantFilter(''); setCustomerFilter(''); setDateFrom(''); setDateTo(''); setStatusFilter('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Refund Management</h1>
          <p className="text-muted-foreground text-sm">Process and track customer refunds</p>
        </div>
        <Button size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Refunded',    value: `$${(totalProcessed/1000).toFixed(1)}K`, sub: 'Processed',      color: 'text-foreground' },
          { label: 'Pending Approval',  value: pendingCount,                            sub: 'Awaiting review', color: 'text-yellow-500' },
          { label: 'Average Refund',    value: `$${avgAmt.toFixed(0)}`,                 sub: 'Per refund',      color: 'text-foreground' },
          { label: 'Rejection Rate',    value: `${rejRate.toFixed(1)}%`,                sub: 'This month',      color: 'text-destructive' },
        ].map(({ label, value, sub, color }) => (
          <Card key={label} className="p-4 border border-border">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
          </Card>
        ))}
      </div>

      {/* Search + filter toggle */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search refund ID, customer, merchant…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(p => !p)}
          className="gap-2 relative"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

            {/* Merchant filter */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" /> Merchant
              </label>
              <select
                value={merchantFilter}
                onChange={e => setMerchantFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="">All Merchants</option>
                {merchants.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Customer filter */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <User className="w-3.5 h-3.5" /> Customer
              </label>
              <select
                value={customerFilter}
                onChange={e => setCustomerFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="">All Customers</option>
                {customers.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Date From */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" /> Date From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>

            {/* Date To */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" /> Date To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>

          {/* Status + clear */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <div className="flex gap-2 flex-wrap flex-1">
              {['', 'pending', 'approved', 'processed', 'rejected'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    statusFilter === s
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted/50 text-muted-foreground border-border hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {s === '' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear all
              </button>
            )}
          </div>
        </Card>
      )}

      {/* List + panel */}
      <div className="flex gap-4 items-start">

        {/* Refund list */}
        <div className="flex-1 min-w-0">
          <Card className="overflow-hidden">

            {/* List header */}
            <div className="grid grid-cols-12 px-4 py-2.5 bg-muted/40 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-2">Customer</div>
              <div className="col-span-2">Merchant</div>
              <div className="col-span-2">Refund Amount</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Rejection Cause</div>
              <div className="col-span-1">Status</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">No refunds match your filters.</div>
              ) : filtered.map(refund => {
                const isSelected = selectedId === refund.id;
                return (
                  <div
                    key={refund.id}
                    onClick={() => setSelectedId(isSelected ? null : refund.id)}
                    className={`grid grid-cols-12 px-4 py-3.5 cursor-pointer transition-all duration-150 select-none ${
                      isSelected
                        ? 'bg-indigo-500/10 border-l-[3px] border-l-indigo-500'
                        : 'hover:bg-muted/40 border-l-[3px] border-l-transparent'
                    }`}
                  >
                    {/* Customer */}
                    <div className="col-span-2 flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getGrad(refund.customerName)} border flex items-center justify-center flex-shrink-0`}>
                        <span className="text-[10px] font-black">{getInitials(refund.customerName)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold truncate ${isSelected ? 'text-indigo-300' : 'text-foreground'}`}>
                          {refund.customerName}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono truncate">{refund.id}</p>
                      </div>
                    </div>

                    {/* Merchant */}
                    <div className="col-span-2 flex items-center gap-2 min-w-0">
                      <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${getGrad(refund.merchantName)} border flex items-center justify-center flex-shrink-0`}>
                        <Building2 className="w-3 h-3" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{refund.merchantName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{reasonLabel[refund.reason]}</p>
                      </div>
                    </div>

                    {/* Refund Amount */}
                    <div className="col-span-2 flex flex-col justify-center">
                      <p className="text-sm font-bold text-emerald-400">${refund.refundAmount}</p>
                      <p className="text-[10px] text-muted-foreground">of ${refund.originalAmount}</p>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 flex flex-col justify-center">
                      <p className="text-xs text-foreground font-medium">
                        {refund.requestedAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {refund.requestedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* Rejection Cause */}
                    <div className="col-span-2 flex flex-col justify-center">
                      {refund.status === 'rejected' ? (
                        <>
                          <p className="text-xs text-red-400 font-semibold truncate">
                            {['Insufficient Evidence', 'Outside Policy', 'Item Not Returned', 'Fraud Suspected'][parseInt(refund.id.replace(/\D/g,'')) % 4]}
                          </p>
                          <p className="text-[10px] text-muted-foreground">by admin</p>
                        </>
                      ) : (
                        <p className="text-[10px] text-muted-foreground/40">—</p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="col-span-1 flex items-center">
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0.5 ${statusColors[refund.status as keyof typeof statusColors]}`}>
                        {refund.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-border bg-muted/20 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{' '}
                <span className="font-semibold text-foreground">{mockRefunds.length}</span> refunds
              </span>
            </div>
          </Card>
        </div>

        {/* Detail panel */}
        {selected && (
          <div
            className="w-64 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl sticky top-4 animate-in slide-in-from-right-4 fade-in duration-200"
            style={{ background: '#0f1117', border: '1px solid #1e2330' }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Refund Detail</span>
              <button
                onClick={() => setSelectedId(null)}
                className="w-5 h-5 flex items-center justify-center rounded-md text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="px-4 pb-4 space-y-4">
              {/* ID + status */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-400">{selected.id}</span>
                <Badge variant="outline" className={`text-[10px] ${statusColors[selected.status as keyof typeof statusColors]}`}>
                  {selected.status}
                </Badge>
              </div>

              {/* Customer */}
              <div className="space-y-1 border-b border-gray-800 pb-3">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Customer</p>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getGrad(selected.customerName)} border flex items-center justify-center flex-shrink-0`}>
                    <span className="text-[10px] font-black">{getInitials(selected.customerName)}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{selected.customerName}</p>
                    <p className="text-[10px] text-gray-500">{selected.customerId}</p>
                  </div>
                </div>
              </div>

              {/* Merchant */}
              <div className="space-y-1 border-b border-gray-800 pb-3">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Merchant</p>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${getGrad(selected.merchantName)} border flex items-center justify-center flex-shrink-0`}>
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs font-bold text-white">{selected.merchantName}</p>
                </div>
              </div>

              {/* Amounts */}
              <div className="space-y-1 border-b border-gray-800 pb-3">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Refund Amount</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-emerald-400">${selected.refundAmount}</span>
                  <span className="text-xs text-gray-500 mb-0.5">of ${selected.originalAmount}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 mt-1">
                  <div
                    className="h-1.5 rounded-full bg-emerald-500"
                    style={{ width: `${Math.min((selected.refundAmount / selected.originalAmount) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-500">{((selected.refundAmount / selected.originalAmount)*100).toFixed(0)}% of original</p>
              </div>

              {/* Meta */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Details</p>
                {[
                  { label: 'Order',   value: selected.orderId },
                  { label: 'Reason',  value: reasonLabel[selected.reason] },
                  { label: 'Date',    value: selected.requestedAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">{label}</span>
                    <span className="text-[11px] font-semibold text-gray-300">{value}</span>
                  </div>
                ))}
              </div>

              {/* Cause of rejection — only for rejected refunds */}
              {selected.status === 'rejected' && (
                <div className="space-y-2 pt-1 border-t border-gray-800">
                  <p className="text-[10px] font-bold text-red-500/80 uppercase tracking-widest">Cause of Rejection</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { key: 'insufficient_evidence', label: 'Insufficient Evidence' },
                      { key: 'outside_policy',        label: 'Outside Policy Window' },
                      { key: 'item_returned',         label: 'Item Not Returned' },
                      { key: 'duplicate_request',     label: 'Duplicate Request' },
                      { key: 'fraud_suspected',       label: 'Fraud Suspected' },
                    ].map(opt => (
                      <span
                        key={opt.key}
                        className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20"
                      >
                        {opt.label}
                      </span>
                    ))}
                  </div>
                  <textarea
                    placeholder="Add a note about why this was rejected…"
                    rows={3}
                    className="w-full mt-1 px-3 py-2 text-[11px] rounded-lg bg-gray-800/60 border border-gray-700 text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}