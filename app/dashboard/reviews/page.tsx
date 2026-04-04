'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Search, X, Eye, Star, AlertTriangle, MessageSquare,
  Clock, Building2, User, ChevronRight, ShieldBan,
  EyeOff, Flag, CheckCircle, ArrowUpDown, ArrowUp, ArrowDown,
} from 'lucide-react';
import { formatDate } from '@/lib/helpers';
import { mockReviews } from '@/lib/mock-moderation-data';
import { Review } from '@/types/review';

// ─── Config ───────────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; dot: string; badge: string }> = {
  visible: { label: 'Visible', dot: 'bg-green-500', badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
  hidden: { label: 'Hidden', dot: 'bg-gray-500', badge: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  flagged: { label: 'Flagged', dot: 'bg-red-500', badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const riskConfig: Record<string, { label: string; color: string; bg: string }> = {
  low: { label: 'Low', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  medium: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  high: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
};

const panelGradients = [
  'from-violet-500/20 to-indigo-500/20 border-violet-500/25 text-violet-300',
  'from-blue-500/20 to-cyan-500/20 border-blue-500/25 text-blue-300',
  'from-rose-500/20 to-pink-500/20 border-rose-500/25 text-rose-300',
  'from-emerald-500/20 to-teal-500/20 border-emerald-500/25 text-emerald-300',
  'from-orange-500/20 to-amber-500/20 border-orange-500/25 text-orange-300',
];

const getGradient = (id: string) => panelGradients[(parseInt(id.replace(/\D/g, '')) || 0) % panelGradients.length];
const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
const renderStars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

/** Simulated merchant response time based on review id */
function mockResponseTime(id: string): string {
  const n = parseInt(id.replace(/\D/g, '')) || 1;
  const hours = [2, 5, 11, 24, 48, 3, 8, 0.5, 72, 1][n % 10];
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

/** Simulated merchant name from review */
function mockMerchant(review: Review): string {
  return review.businessName ?? 'Unknown Merchant';
}

// ─── Sort icon ────────────────────────────────────────────────────────────────
function SortIcon({ col, sortKey, dir }: { col: string; sortKey: string; dir: 'asc' | 'desc' }) {
  if (col !== sortKey) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-30" />;
  return dir === 'asc'
    ? <ArrowUp className="w-3 h-3 ml-1 text-primary" />
    : <ArrowDown className="w-3 h-3 ml-1 text-primary" />;
}

// ─── Review detail panel ──────────────────────────────────────────────────────
function ReviewPanel({ review, onClose }: { review: Review; onClose: () => void }) {
  const sc = statusConfig[review.status] ?? statusConfig.visible;
  const rc = riskConfig[review.riskLevel ?? 'low'] ?? riskConfig.low;
  const gradient = getGradient(review.id);
  const respTime = mockResponseTime(review.id);
  const merchant = mockMerchant(review);

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 fade-in duration-200">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Review Details</span>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">

        {/* Identity */}
        <div className="px-5 pb-5 border-b border-gray-800">
          <div className="flex flex-col items-center text-center gap-3">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} border-2 flex items-center justify-center shadow-lg`}>
              <span className="text-lg font-black">{getInitials(review.userName)}</span>
            </div>
            <div className="w-full">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className={`text-base font-black tracking-widest ${review.rating >= 4 ? 'text-amber-400' : review.rating >= 3 ? 'text-yellow-500' : 'text-red-400'
                  }`}>
                  {renderStars(review.rating)}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white leading-snug mt-1">{review.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{review.userName}</p>
              <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {sc.label}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${rc.bg} ${rc.color}`}>
                  {rc.label} Risk
                </span>
                {review.verified && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Review content */}
        <div className="px-5 py-4 border-b border-gray-800">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Content</p>
          <p className="text-xs text-gray-300 leading-relaxed">{review.content}</p>
        </div>

        {/* Info grid */}
        <div className="px-5 py-4 border-b border-gray-800">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Details</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Building2, label: 'Merchant', value: merchant, color: 'text-purple-400', bg: 'bg-purple-500/8' },
              { icon: Clock, label: 'Resp. Time', value: respTime, color: 'text-cyan-400', bg: 'bg-cyan-500/8' },
              { icon: Star, label: 'Rating', value: `${review.rating} / 5`, color: 'text-amber-400', bg: 'bg-amber-500/8' },
              { icon: AlertTriangle, label: 'Spam Score', value: `${review.spamScore ?? 0}%`, color: review.spamScore > 50 ? 'text-red-400' : 'text-gray-400', bg: review.spamScore > 50 ? 'bg-red-500/8' : 'bg-gray-700/30' },
              { icon: Flag, label: 'Flag Count', value: review.flagCount ?? 0, color: review.flagCount > 0 ? 'text-orange-400' : 'text-gray-400', bg: review.flagCount > 0 ? 'bg-orange-500/8' : 'bg-gray-700/30' },
              { icon: User, label: 'Product', value: review.productName, color: 'text-blue-400', bg: 'bg-blue-500/8' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className={`${bg} border border-white/[0.04] rounded-xl px-3 py-2.5`}>
                <div className="flex items-center gap-1 mb-1">
                  <Icon className={`w-3 h-3 ${color}`} />
                  <p className="text-[9px] text-gray-600 font-bold uppercase tracking-wide">{label}</p>
                </div>
                <p className={`text-xs font-bold truncate ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Actions</p>

          {review.status !== 'visible' && (
            <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-green-600/80 hover:bg-green-500 active:scale-[0.98] text-white text-xs font-bold transition-all group shadow-lg shadow-green-900/20">
              <Eye className="w-3.5 h-3.5" />
              <span className="flex-1 text-left">Approve Review</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {review.status !== 'hidden' && (
            <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white text-xs font-bold transition-all group active:scale-[0.98]">
              <EyeOff className="w-3.5 h-3.5" />
              <span className="flex-1 text-left">Hide Review</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {review.status !== 'flagged' && (
            <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 hover:text-orange-300 text-xs font-bold transition-all group active:scale-[0.98]">
              <Flag className="w-3.5 h-3.5" />
              <span className="flex-1 text-left">Flag Review</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-gray-700/80 bg-transparent hover:bg-red-500/10 hover:border-red-500/30 text-red-400 hover:text-red-300 text-xs font-bold transition-all group active:scale-[0.98]">
            <ShieldBan className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">Delete Review</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="h-3" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ReviewsPage() {
  const [sortKey, setSortKey] = useState<keyof Review>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const statusOptions = ['visible', 'hidden', 'flagged'];
  const statusCounts = {
    visible: mockReviews.filter(r => r.status === 'visible').length,
    hidden: mockReviews.filter(r => r.status === 'hidden').length,
    flagged: mockReviews.filter(r => r.status === 'flagged').length,
  };

  const filtered = mockReviews.filter(r => {
    const q = searchTerm.toLowerCase();
    return (
      (!q || r.productName.toLowerCase().includes(q) || r.userName.toLowerCase().includes(q) || r.content.toLowerCase().includes(q)) &&
      (!statusFilter || r.status === statusFilter)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (av == null) return 1; if (bv == null) return -1;
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Review) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const selectedReview = mockReviews.find(r => r.id === selectedId) ?? null;

  const avgRating = (mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length).toFixed(1);
  const flaggedCount = mockReviews.filter(r => r.flagged).length;
  const highRiskCount = mockReviews.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical').length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reviews & Moderation</h1>
        <p className="text-muted-foreground text-sm mt-1">Review, monitor, and moderate user reviews and feedback</p>
      </div>

      {/* Status filter tabs + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reviews, authors or products…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter(null)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${!statusFilter ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40'
              }`}
          >
            All ({mockReviews.length})
          </button>
          {statusOptions.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all capitalize ${statusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40'
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
          { label: 'Total Reviews', value: mockReviews.length, color: 'text-foreground' },
          { label: 'Flagged', value: flaggedCount, color: 'text-red-400' },
          { label: 'Avg Rating', value: `${avgRating} ★`, color: 'text-amber-400' },
          { label: 'High Risk', value: highRiskCount, color: 'text-orange-400' },
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  {[
                    { key: 'title', label: 'Review', cls: 'w-48 text-left' },
                    { key: 'userName', label: 'Author', cls: 'text-left hidden sm:table-cell' },
                    { key: 'productName', label: 'Product', cls: 'text-left hidden md:table-cell' },
                    { key: null, label: 'Merchant', cls: 'text-left hidden lg:table-cell' },
                    { key: 'rating', label: 'Rating', cls: 'text-center' },
                    { key: 'status', label: 'Status', cls: 'text-left' },
                    { key: 'spamScore', label: 'Risk', cls: 'text-center hidden md:table-cell' },
                    { key: null, label: 'Resp. Time', cls: 'text-center hidden lg:table-cell' },
                    { key: 'flagCount', label: 'Flags', cls: 'text-center hidden md:table-cell' },
                    { key: 'createdAt', label: 'Date', cls: 'text-left hidden lg:table-cell' },
                    { key: null, label: 'View', cls: 'text-right' },
                  ].map(({ key, label, cls }, i) => (
                    <th key={i} className={`px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${cls}`}>
                      {key ? (
                        <button
                          onClick={() => handleSort(key as keyof Review)}
                          className="flex items-center hover:text-foreground transition-colors"
                        >
                          {label}
                          <SortIcon col={key} sortKey={sortKey} dir={sortDir} />
                        </button>
                      ) : label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-sm text-muted-foreground">No reviews found.</td>
                  </tr>
                ) : sorted.map(review => {
                  const isSelected = selectedId === review.id;
                  const sc = statusConfig[review.status] ?? statusConfig.visible;
                  const rc = riskConfig[review.riskLevel ?? 'low'] ?? riskConfig.low;
                  const rtp = mockResponseTime(review.id);
                  const merchant = mockMerchant(review);

                  return (
                    <tr
                      key={review.id}
                      onClick={() => setSelectedId(isSelected ? null : review.id)}
                      className={`cursor-pointer transition-all duration-150 select-none ${isSelected
                          ? 'bg-indigo-500/10 border-l-[3px] border-l-indigo-500'
                          : 'hover:bg-muted/40 border-l-[3px] border-l-transparent'
                        }`}
                    >
                      {/* Review title + snippet */}
                      <td className="px-3 py-3.5 w-48">
                        <p className={`text-sm font-semibold truncate leading-tight ${isSelected ? 'text-indigo-300' : 'text-foreground'}`}>
                          {review.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate max-w-[160px]">{review.content}</p>
                      </td>

                      {/* Author */}
                      <td className="px-3 py-3.5 hidden sm:table-cell">
                        <p className="text-sm text-foreground">{review.userName}</p>
                        <p className="text-[10px] text-muted-foreground">{review.verified ? '✓ Verified' : 'Unverified'}</p>
                      </td>

                      {/* Product */}
                      <td className="px-3 py-3.5 hidden md:table-cell">
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">{review.productName}</p>
                      </td>

                      {/* Merchant ← NEW */}
                      <td className="px-3 py-3.5 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3 h-3 text-purple-400 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground truncate max-w-[110px]">{merchant}</p>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="px-3 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold text-foreground">{review.rating}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border ${sc.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </td>

                      {/* Risk */}
                      <td className="px-3 py-3.5 text-center hidden md:table-cell">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${rc.bg} ${rc.color}`}>
                          {rc.label}
                        </span>
                      </td>

                      {/* Avg Response Time ← NEW */}
                      <td className="px-3 py-3.5 text-center hidden lg:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span className="text-xs font-semibold text-cyan-400">{rtp}</span>
                        </div>
                      </td>

                      {/* Flags */}
                      <td className="px-3 py-3.5 text-center hidden md:table-cell">
                        <span className={`text-sm font-bold ${review.flagCount > 0 ? 'text-orange-400' : 'text-muted-foreground'}`}>
                          {review.flagCount ?? 0}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-3 py-3.5 hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                      </td>

                      {/* View ← NEW */}
                      <td className="px-3 py-3.5" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-end">
                          <button
                            onClick={() => setSelectedId(isSelected ? null : review.id)}
                            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${isSelected ? 'bg-indigo-500/20 text-indigo-400' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                              }`}
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{sorted.length}</span> of{' '}
              <span className="font-semibold text-foreground">{mockReviews.length}</span> reviews
            </span>
            {selectedReview && (
              <span className="text-xs text-indigo-400 font-medium animate-in fade-in">
                Viewing: {selectedReview.title}
              </span>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selectedReview && (
          <div
            className="w-72 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl"
            style={{ background: '#0f1117', border: '1px solid #1e2330' }}
          >
            <ReviewPanel review={selectedReview} onClose={() => setSelectedId(null)} />
          </div>
        )}
      </div>
    </div>
  );
}