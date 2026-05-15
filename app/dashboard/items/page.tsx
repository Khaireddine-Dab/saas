'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Search, Plus, ArrowUpDown, ArrowUp, ArrowDown,
  Eye, Star, Package, Clock, Loader2,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatDate } from '@/lib/helpers';
import { useItems } from '@/hooks/useItems';
import type { Item } from '@/types/item';

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; dot: string; badge: string }> = {
  AVAILABLE: { label: 'Disponible', dot: 'bg-green-500',  badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
  HIDDEN:    { label: 'Caché',      dot: 'bg-gray-500',   badge: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  FLAGGED:   { label: 'Signalé',    dot: 'bg-red-500',    badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
  BANNED:    { label: 'Interdit',   dot: 'bg-rose-600',   badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
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
export default function ItemsPage() {
  const router = useRouter();
  const { items, isLoading, error, fetchItems } = useItems();
  
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  
  const [sortKey,       setSortKey]       = useState<keyof Item>('createdAt');
  const [sortDir,       setSortDir]       = useState<'asc' | 'desc'>('desc');
  const [searchTerm,    setSearchTerm]    = useState('');
  const [statusFilter,  setStatusFilter]  = useState<string | null>(null);
  const [typeFilter,    setTypeFilter]    = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Chargement des items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Items</h1>
          <p className="text-muted-foreground text-sm mt-1">Surveiller et modérer tous les produits et services de la marketplace</p>
        </div>
        <div className="bg-card border border-red-500/30 rounded-xl p-8 text-center">
          <p className="text-red-400">Erreur: {error}</p>
        </div>
      </div>
    );
  }

  const statusOptions = ['AVAILABLE', 'HIDDEN', 'FLAGGED', 'BANNED'] as const;
  const typeOptions = ['PRODUCT', 'SERVICE'];
  
  const statusCounts = {
    AVAILABLE: items.filter(i => i.status === 'AVAILABLE').length,
    HIDDEN:    items.filter(i => i.status === 'HIDDEN').length,
    FLAGGED:   items.filter(i => i.status === 'FLAGGED').length,
    BANNED:    items.filter(i => i.status === 'BANNED').length,
  };

  const typeCounts = {
    PRODUCT: items.filter(i => i.itemType === 'PRODUCT').length,
    SERVICE: items.filter(i => i.itemType === 'SERVICE').length,
  };

  const filtered = items.filter(i => {
    const q = searchTerm.toLowerCase();
    return (
      (!q || i.name.toLowerCase().includes(q) || i.storeName.toLowerCase().includes(q)) &&
      (!statusFilter || i.status === statusFilter) &&
      (!typeFilter || i.itemType === typeFilter)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (av == null) return 1; if (bv == null) return -1;
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Item) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const avgRating = items.length > 0 ? (items.reduce((s, i) => s + i.ratingAverage, 0) / items.length).toFixed(1) : '0';

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Items (Produits & Services)</h1>
          <p className="text-muted-foreground text-sm mt-1">Surveiller et modérer tous les produits et services de la marketplace</p>
        </div>
        {/* ── Action buttons ── */}
        <div className="flex items-center gap-2">
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter Item
          </Button>
        </div>
      </div>

      {/* Type filter tabs + Status filter tabs + search */}
      <div className="flex flex-col gap-4">
        
        {/* Type filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setTypeFilter(null)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              !typeFilter ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40'
            }`}
          >
            Tous ({items.length})
          </button>
          {typeOptions.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-2 ${
                typeFilter === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40'
              }`}
            >
              {t === 'PRODUCT' ? (
                <>
                  <Package className="w-3 h-3" />
                  Produits ({typeCounts.PRODUCT})
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  Services ({typeCounts.SERVICE})
                </>
              )}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cherchez des items ou des marchands..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter(null)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              !statusFilter ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40'
            }`}
          >
            Tous ({items.length})
          </button>
          {statusOptions.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                statusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40'
              }`}
            >
              {statusConfig[s].label} ({statusCounts[s as keyof typeof statusCounts]})
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Items',   value: formatNumber(items.length),      color: 'text-foreground' },
          { label: 'Disponibles',   value: statusCounts.AVAILABLE,          color: 'text-green-400' },
          { label: 'Signalés',      value: statusCounts.FLAGGED,            color: 'text-red-400' },
          { label: 'Note Moyenne',  value: `${avgRating} ★`,                color: 'text-amber-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">

        {/* Column headers */}
        <div className="grid grid-cols-12 px-4 py-3 border-b border-border bg-muted/30">
          {/* Item */}
          <button onClick={() => handleSort('name')} className="col-span-3 flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            Item <SortIcon col="name" sortKey={sortKey} dir={sortDir} />
          </button>
          {/* Type */}
          <button onClick={() => handleSort('itemType')} className="col-span-1 hidden sm:flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            Type <SortIcon col="itemType" sortKey={sortKey} dir={sortDir} />
          </button>
          {/* Price */}
          <button onClick={() => handleSort('price')} className="col-span-1 flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            Prix <SortIcon col="price" sortKey={sortKey} dir={sortDir} />
          </button>
          {/* Stock/Duration */}
          <button onClick={() => handleSort('stockQuantity')} className="col-span-1 hidden sm:flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            Stock/Durée <SortIcon col="stockQuantity" sortKey={sortKey} dir={sortDir} />
          </button>
          {/* Status */}
          <button onClick={() => handleSort('status')} className="col-span-2 flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            Statut <SortIcon col="status" sortKey={sortKey} dir={sortDir} />
          </button>
          {/* Orders/Bookings */}
          <button onClick={() => handleSort('orderCount')} className="col-span-1 hidden md:flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            Cdes/Rés <SortIcon col="orderCount" sortKey={sortKey} dir={sortDir} />
          </button>
          {/* Rating */}
          <button onClick={() => handleSort('ratingAverage')} className="col-span-1 hidden md:flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            Rating <SortIcon col="ratingAverage" sortKey={sortKey} dir={sortDir} />
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
            <div className="py-12 text-center text-sm text-muted-foreground">Aucun item trouvé.</div>
          ) : sorted.map(item => {
            const sc = statusConfig[item.status] ?? statusConfig.AVAILABLE;
            const storeSlug = item.storeName.toLowerCase().replace(/\s+/g, '-');

            return (
              <div
                key={item.id}
                className="grid grid-cols-12 px-4 py-3.5 border-l-[3px] border-l-transparent hover:bg-muted/40 transition-all duration-150"
              >
                {/* Item */}
                <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${getGradient(item.id)} border flex items-center justify-center flex-shrink-0`}>
                    <span className="text-[10px] font-black">{getInitials(item.name)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate leading-tight text-foreground">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{item.storeName}</p>
                  </div>
                </div>

                {/* Type */}
                <div className="col-span-1 hidden sm:flex items-center">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                    item.itemType === 'PRODUCT' 
                      ? 'bg-blue-500/10 text-blue-400' 
                      : 'bg-purple-500/10 text-purple-400'
                  }`}>
                    {item.itemType === 'PRODUCT' ? (
                      <>
                        <Package className="w-3 h-3" />
                        Produit
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        Service
                      </>
                    )}
                  </span>
                </div>

                {/* Price */}
                <div className="col-span-1 flex items-center">
                  <span className="text-sm font-semibold text-emerald-400">{formatCurrency(item.price)}</span>
                </div>

                {/* Stock/Duration */}
                <div className="col-span-1 hidden sm:flex items-center">
                  <span className="text-xs text-muted-foreground">
                    {item.itemType === 'PRODUCT'
                      ? `📦 ${item.stockQuantity ?? '-'}`
                      : `⏱ ${item.durationMinutes ?? '-'}min`
                    }
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border ${sc.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {sc.label}
                  </span>
                </div>

                {/* Orders/Bookings */}
                <div className="col-span-1 hidden md:flex items-center">
                  <span className="text-sm font-bold text-muted-foreground">
                    {item.itemType === 'PRODUCT' ? item.orderCount : item.bookingCount}
                  </span>
                </div>

                {/* Rating */}
                <div className="col-span-1 hidden md:flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                  <span className="text-xs font-semibold text-foreground">{item.ratingAverage.toFixed(1)}</span>
                </div>

                {/* Created */}
                <div className="col-span-1 hidden lg:flex items-center">
                  <span className="text-xs text-muted-foreground">{formatDate(item.createdAt.toISOString())}</span>
                </div>

                {/* View store button */}
                <div className="col-span-1 flex items-center justify-end" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => router.push(`/store/${storeSlug}`)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    title={`Visite ${item.storeName}`}
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
            <span className="font-semibold text-foreground">{items.length}</span> items
          </span>
        </div>
      </div>
    </div>
  );
}
