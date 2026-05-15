'use client';

import React, { useEffect, useState } from 'react';
import { useReviews } from '@/hooks/useReviews';
import { useLanguage } from '@/contexts/language-context';
import {
  Star,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Eye,
  Building2,
  Clock,
  Flag,
  MessageSquare,
  X,
  EyeOff,
  ShieldBan,
  ChevronRight,
} from 'lucide-react';

export default function ReviewsPage() {
  const { reviews, isLoading, error, metrics, fetchReviews, deleteReview, moderateReview } = useReviews();
  const { language } = useLanguage();
  
  const [sortKey, setSortKey] = useState<'id' | 'rating' | 'createdAt' | 'title' | 'helpful' | 'unhelpful'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const statusOptions = ['pending', 'approved', 'rejected', 'spam'];
  const statusCounts = {
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    spam: reviews.filter(r => r.status === 'spam').length,
  };

  const filtered = reviews.filter(r => {
    const q = searchTerm.toLowerCase();
    return (
      (!q || r.title.toLowerCase().includes(q) || r.userName.toLowerCase().includes(q) || r.content.toLowerCase().includes(q)) &&
      (!statusFilter || r.status === statusFilter)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (av == null) return 1;
    if (bv == null) return -1;
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const selectedReview = reviews.find(r => r.id === selectedId) ?? null;

  const flaggedCount = reviews.filter(r => (r.flagCount ?? 0) > 0).length;
  const highRiskCount = reviews.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical').length;

  const handleApprove = async (reviewId: string) => {
    try {
      await moderateReview(reviewId, { status: 'approved' });
      alert('Review approved successfully');
    } catch (err) {
      alert('Error approving review');
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      await moderateReview(reviewId, { status: 'rejected' });
      alert('Review rejected successfully');
    } catch (err) {
      alert('Error rejecting review');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
        alert('Review deleted successfully');
      } catch (err) {
        alert('Error deleting review');
      }
    }
  };

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
            All ({reviews.length})
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
          { label: 'Total Reviews', value: reviews.length, color: 'text-foreground' },
          { label: 'Flagged', value: flaggedCount, color: 'text-red-400' },
          { label: 'Avg Rating', value: `${metrics.avgRating.toFixed(1)} ★`, color: 'text-amber-400' },
          { label: 'High Risk', value: highRiskCount, color: 'text-orange-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64 bg-card rounded-lg border border-border">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-foreground">Loading reviews...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-red-300 font-semibold">Error loading reviews</p>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Table + panel */}
      {!isLoading && !error && (
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
                      { key: 'rating', label: 'Rating', cls: 'text-center' },
                      { key: 'status', label: 'Status', cls: 'text-left' },
                      { key: 'riskLevel', label: 'Risk', cls: 'text-center hidden md:table-cell' },
                      { key: 'helpful', label: 'Helpful', cls: 'text-center hidden md:table-cell' },
                      { key: 'createdAt', label: 'Date', cls: 'text-left hidden lg:table-cell' },
                      { key: null, label: 'View', cls: 'text-right' },
                    ].map(({ key, label, cls }, i) => (
                      <th key={i} className={`px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${cls}`}>
                        {key ? (
                          <button
                            onClick={() => handleSort(key as typeof sortKey)}
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
                      <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">No reviews found.</td>
                    </tr>
                  ) : sorted.map(review => {
                    const isSelected = selectedId === review.id;
                    
                    const getStatusBadge = (status: string) => {
                      const badges: Record<string, string> = {
                        approved: 'bg-green-500/10 text-green-400 border-green-500/20',
                        rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
                        pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                        spam: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                      };
                      return badges[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
                    };

                    const getRiskBadge = (risk: string) => {
                      const badges: Record<string, string> = {
                        low: 'bg-green-500/10 text-green-400 border-green-500/20',
                        medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                        high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                        critical: 'bg-red-500/10 text-red-400 border-red-500/20',
                      };
                      return badges[risk] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
                    };

                    const formatDate = (date: any) => {
                      if (!date) return 'N/A';
                      const d = new Date(date);
                      return d.toLocaleDateString();
                    };

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
                          <p className="text-[11px] text-muted-foreground truncate max-w-[160px]">{review.content?.substring(0, 50)}</p>
                        </td>

                        {/* Author */}
                        <td className="px-3 py-3.5 hidden sm:table-cell">
                          <p className="text-sm text-foreground">{review.userName}</p>
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
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border ${getStatusBadge(review.status)}`}>
                            {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                          </span>
                        </td>

                        {/* Risk */}
                        <td className="px-3 py-3.5 text-center hidden md:table-cell">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(review.riskLevel)}`}>
                            {review.riskLevel ? review.riskLevel.charAt(0).toUpperCase() + review.riskLevel.slice(1) : 'N/A'}
                          </span>
                        </td>

                        {/* Helpful count */}
                        <td className="px-3 py-3.5 text-center hidden md:table-cell">
                          <span className="text-sm font-bold text-green-400">{review.helpful || 0}</span>
                        </td>

                        {/* Date */}
                        <td className="px-3 py-3.5 hidden lg:table-cell">
                          <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                        </td>

                        {/* View button */}
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
                <span className="font-semibold text-foreground">{reviews.length}</span> reviews
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
            <div className="w-72 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl bg-card border border-border">
              <ReviewPanel review={selectedReview} onClose={() => setSelectedId(null)} onApprove={handleApprove} onReject={handleReject} onDelete={handleDelete} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sort icon
function SortIcon({ col, sortKey, dir }: { col: string; sortKey: string; dir: 'asc' | 'desc' }) {
  if (col !== sortKey) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-30" />;
  return dir === 'asc'
    ? <ArrowUp className="w-3 h-3 ml-1 text-primary" />
    : <ArrowDown className="w-3 h-3 ml-1 text-primary" />;
}

// ─── Review detail panel
function ReviewPanel({ review, onClose, onApprove, onReject, onDelete }: { review: any; onClose: () => void; onApprove: (id: string) => void; onReject: (id: string) => void; onDelete: (id: string) => void; }) {
  const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const renderStars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);
  
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; bg: string; dot: string }> = {
      approved: { label: 'Approved', bg: 'bg-green-500/10 text-green-400 border-green-500/20', dot: 'bg-green-500' },
      rejected: { label: 'Rejected', bg: 'bg-red-500/10 text-red-400 border-red-500/20', dot: 'bg-red-500' },
      pending: { label: 'Pending', bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', dot: 'bg-yellow-500' },
      spam: { label: 'Spam', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20', dot: 'bg-purple-500' },
    };
    return badges[status] || { label: 'Unknown', bg: 'bg-gray-500/10 text-gray-400 border-gray-500/20', dot: 'bg-gray-500' };
  };

  const getRiskBadge = (risk: string) => {
    const badges: Record<string, { label: string; bg: string; color: string }> = {
      low: { label: 'Low', bg: 'bg-green-500/10 border-green-500/20', color: 'text-green-400' },
      medium: { label: 'Medium', bg: 'bg-yellow-500/10 border-yellow-500/20', color: 'text-yellow-400' },
      high: { label: 'High', bg: 'bg-orange-500/10 border-orange-500/20', color: 'text-orange-400' },
      critical: { label: 'Critical', bg: 'bg-red-500/10 border-red-500/20', color: 'text-red-400' },
    };
    return badges[risk] || { label: 'Unknown', bg: 'bg-gray-500/10 border-gray-500/20', color: 'text-gray-400' };
  };

  const sc = getStatusBadge(review.status);
  const rc = getRiskBadge(review.riskLevel ?? 'low');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Details</span>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Identity */}
        <div className="px-5 py-5 border-b border-border">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
              <span className="text-lg font-black">{getInitials(review.userName)}</span>
            </div>
            <div className="w-full">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className="text-base font-black tracking-widest">
                  {renderStars(review.rating)}
                </span>
              </div>
              <h3 className="text-sm font-bold leading-snug mt-1">{review.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{review.userName}</p>
              <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {sc.label}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${rc.bg} ${rc.color}`}>
                  {rc.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Review content */}
        <div className="px-5 py-4 border-b border-border">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Content</p>
          <p className="text-xs leading-relaxed">{review.content}</p>
        </div>

        {/* Info grid */}
        <div className="px-5 py-4 border-b border-border space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Details</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Helpful</span>
            <span className="font-semibold text-green-400">{review.helpful || 0}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Unhelpful</span>
            <span className="font-semibold text-red-400">{review.unhelpful || 0}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Spam Score</span>
            <span className="font-semibold">{(review.spamScore ?? 0)}%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Flags</span>
            <span className="font-semibold">{review.flagCount ?? 0}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Actions</p>

          {review.status !== 'approved' && (
            <button
              onClick={() => onApprove(review.id)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-green-600/80 hover:bg-green-500 text-white text-xs font-bold transition-all"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="flex-1 text-left">Approve</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          )}

          {review.status !== 'rejected' && (
            <button
              onClick={() => onReject(review.id)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-bold transition-all border border-border"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span className="flex-1 text-left">Reject</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </button>
          )}

          <button
            onClick={() => onDelete(review.id)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-destructive/30 bg-destructive/10 hover:bg-destructive/20 text-destructive hover:text-destructive text-xs font-bold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">Delete</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>
        </div>
      </div>
    </div>
  );
}
