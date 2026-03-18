'use client';

// ⚠️ IMPORTANT: Do NOT import anything from moderation files here.
// This page uses Product / mockProducts only.

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Search, Plus, ArrowUpDown, ArrowUp, ArrowDown,
  Eye, Star, Shield,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatDate } from '@/lib/helpers';
import { mockProducts } from '@/lib/mock-data';
import { Product } from '@/types/product';
// NO imports from '@/types/moderation' or '@/lib/mock-moderation-data'

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; dot: string; badge: string }> = {
  visible: { label: 'Visible', dot: 'bg-green-500',  badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
  hidden:  { label: 'Hidden',  dot: 'bg-gray-500',   badge: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  flagged: { label: 'Flagged', dot: 'bg-red-500',    badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
  banned:  { label: 'Banned',  dot: 'bg-rose-600',   badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
};

const rowGradients = [
  'from-violet-500/20 to-indigo-500/20 border-violet-500/25 text-violet-300',
  'from-blue-500/20 to-cyan-500/20 border-blue-500/25 text-blue-300',
  'from-emerald-500/20 to-teal-500/20 border-emerald-500/25 text-emerald-300',
  'from-orange-500/20 to-amber-500/20 border-orange-500/25 text-orange-300',
  'from-rose-500/20 to-pink-500/20 border-rose-500/25 text-rose-300',
];

function getGradient(id: string) {
  const n = parseInt(id.replace(/\D/g, '')) || 0;
  return rowGradients[n % rowGradients.length];
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// ─── Sort icon ────────────────────────────────────────────────────────────────
function SortIcon({ col, sortKey, dir }: { col: string; sortKey: string; dir: 'asc' | 'desc' }) {
  if (col !== sortKey) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-30" />;
  return dir === 'asc'
    ? <ArrowUp className="w-3 h-3 ml-1 text-primary" />
    : <ArrowDown className="w-3 h-3 ml-1 text-primary" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const router = useRouter();
  const [sortKey,       setSortKey]       = useState<keyof Product>('createdAt');
  const [sortDir,       setSortDir]       = useState<'asc' | 'desc'>('desc');
  const [searchTerm,    setSearchTerm]    = useState('');
  const [statusFilter,  setStatusFilter]  = useState<string | null>(null);

  const statusOptions = ['visible', 'hidden', 'flagged', 'banned'];
  const statusCounts = {
    visible: mockProducts.filter(p => p.status === 'visible').length,
    hidden:  mockProducts.filter(p => p.status === 'hidden').length,
    flagged: mockProducts.filter(p => p.status === 'flagged').length,
    banned:  mockProducts.filter(p => p.status === 'banned').length,
  };

  const filtered = mockProducts.filter(p => {
    const q = searchTerm.toLowerCase();
    return (
      (!q || p.name.toLowerCase().includes(q) || p.businessName.toLowerCase().includes(q)) &&
      (!statusFilter || p.status === statusFilter)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (av == null) return 1; if (bv == null) return -1;
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Product) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const avgRating = (mockProducts.reduce((s, p) => s + p.averageRating, 0) / mockProducts.length).toFixed(1);

  const cols: { key: keyof Product; label: string }[] = [
    { key: 'name',          label: 'Product' },
    { key: 'category',      label: 'Category' },
    { key: 'price',         label: 'Price' },
    { key: 'status',        label: 'Status' },
    { key: 'totalReports',  label: 'Reports' },
    { key: 'averageRating', label: 'Rating' },
    { key: 'createdAt',     label: 'Created' },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor and moderate all marketplace products</p>
        </div>
        {/* ── Action buttons ── */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-2 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
            onClick={() => router.push('/dashboard/products/moderation')}
          >
            <Shield className="w-4 h-4" />
            Moderation
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Status filter tabs + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products or merchants…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter(null)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              !statusFilter ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40'
            }`}
          >
            All ({mockProducts.length})
          </button>
          {statusOptions.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all capitalize ${
                statusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40'
              }`}
            >
              {s} ({statusCounts[s as keyof typeof statusCounts]})
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: formatNumber(mockProducts.length), color: 'text-foreground' },
          { label: 'Visible',        value: statusCounts.visible,              color: 'text-green-400' },
          { label: 'Flagged',        value: statusCounts.flagged,              color: 'text-red-400' },
          { label: 'Avg Rating',     value: `${avgRating} ★`,                  color: 'text-amber-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table + panel */}
      <div className="flex gap-4 items-start">

        {/* Table */}
        <div className="flex-1 min-w-0 bg-card border border-border rounded-xl overflow-hidden">

          {/* Column headers */}
          <div className="grid grid-cols-12 px-4 py-3 border-b border-border bg-muted/30">
            {/* Product */}
            <button onClick={() => handleSort('name')} className="col-span-3 flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              Product <SortIcon col="name" sortKey={sortKey} dir={sortDir} />
            </button>
            {/* Category */}
            <button onClick={() => handleSort('category')} className="col-span-2 hidden sm:flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              Category <SortIcon col="category" sortKey={sortKey} dir={sortDir} />
            </button>
            {/* Price */}
            <button onClick={() => handleSort('price')} className="col-span-1 flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              Price <SortIcon col="price" sortKey={sortKey} dir={sortDir} />
            </button>
            {/* Status */}
            <button onClick={() => handleSort('status')} className="col-span-2 flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              Status <SortIcon col="status" sortKey={sortKey} dir={sortDir} />
            </button>
            {/* Reports */}
            <button onClick={() => handleSort('totalReports')} className="col-span-1 hidden md:flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              Rep. <SortIcon col="totalReports" sortKey={sortKey} dir={sortDir} />
            </button>
            {/* Rating */}
            <button onClick={() => handleSort('averageRating')} className="col-span-1 hidden md:flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              Rating <SortIcon col="averageRating" sortKey={sortKey} dir={sortDir} />
            </button>
            {/* Created */}
            <button onClick={() => handleSort('createdAt')} className="col-span-1 hidden lg:flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              Created <SortIcon col="createdAt" sortKey={sortKey} dir={sortDir} />
            </button>
            {/* View */}
            <span className="col-span-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">View</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {sorted.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">No products found.</div>
            ) : sorted.map(product => {
              const sc = statusConfig[product.status] ?? statusConfig.visible;
              const storeSlug = product.businessName.toLowerCase().replace(/\s+/g, '-');

              return (
                <div
                  key={product.id}
                  className="grid grid-cols-12 px-4 py-3.5 border-l-[3px] border-l-transparent hover:bg-muted/40 transition-all duration-150"
                >
                  {/* Product */}
                  <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${getGradient(product.id)} border flex items-center justify-center flex-shrink-0`}>
                      <span className="text-[10px] font-black">{getInitials(product.name)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate leading-tight text-foreground">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">{product.businessName}</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-2 hidden sm:flex items-center">
                    <span className="text-xs text-muted-foreground truncate">{product.category}</span>
                  </div>

                  {/* Price */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm font-semibold text-emerald-400">{formatCurrency(product.price, product.currency)}</span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border ${sc.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {sc.label}
                    </span>
                  </div>

                  {/* Reports */}
                  <div className="col-span-1 hidden md:flex items-center">
                    <span className={`text-sm font-bold ${product.totalReports > 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                      {product.totalReports}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="col-span-1 hidden md:flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-foreground">{product.averageRating.toFixed(1)}</span>
                  </div>

                  {/* Created */}
                  <div className="col-span-1 hidden lg:flex items-center">
                    <span className="text-xs text-muted-foreground">{formatDate(product.createdAt.toISOString())}</span>
                  </div>

                  {/* View store button */}
                  <div className="col-span-1 flex items-center justify-end" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => router.push(`/store/${storeSlug}`)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                      title={`Visit ${product.businessName}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{sorted.length}</span> of{' '}
              <span className="font-semibold text-foreground">{mockProducts.length}</span> products
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}