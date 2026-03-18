'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search, Filter, Shield, AlertTriangle, CheckCircle2, XCircle,
    Flag, Eye, Trash2, ChevronDown, TrendingUp, Clock, BarChart3,
    ShieldAlert, Package, ArrowUpDown, ArrowUp, ArrowDown, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockModerationProducts, mockModerationStats } from '@/lib/mock-moderation-data';
import { ModerationProduct, ModerationStatus, RiskLevel, BulkAction } from '@/types/moderation';
import { formatCurrency, formatDate } from '@/lib/helpers';

// ─── Config ────────────────────────────────────────────────────────────────────

const statusConfig: Record<ModerationStatus, { label: string; dot: string; badge: string }> = {
    pending: { label: 'Pending', dot: 'bg-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    approved: { label: 'Approved', dot: 'bg-green-500', badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
    rejected: { label: 'Rejected', dot: 'bg-red-500', badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
    flagged: { label: 'Flagged', dot: 'bg-orange-500', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    reported: { label: 'Reported', dot: 'bg-rose-500', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
};

const riskConfig: Record<RiskLevel, { label: string; badge: string; icon: string }> = {
    low: { label: 'Low', badge: 'bg-green-500/10 text-green-400 border-green-500/20', icon: '🟢' },
    medium: { label: 'Medium', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: '🟡' },
    high: { label: 'High', badge: 'bg-red-500/10 text-red-400 border-red-500/20', icon: '🔴' },
};

const categoryColors: Record<string, string> = {
    Electronics: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Fashion: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Beauty: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    Office: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    Sports: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Kitchen: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Other: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

function SortIcon({ col, sortKey, dir }: { col: string; sortKey: string; dir: 'asc' | 'desc' }) {
    if (col !== sortKey) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-30" />;
    return dir === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 text-primary" /> : <ArrowDown className="w-3 h-3 ml-1 text-primary" />;
}

function TrustScore({ score }: { score: number }) {
    const color = score >= 80 ? 'text-green-400' : score >= 50 ? 'text-amber-400' : 'text-red-400';
    const label = score >= 80 ? 'Trusted' : score >= 50 ? 'Normal' : 'Risky';
    return (
        <div className="flex items-center gap-1">
            <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
            </div>
            <span className={`text-xs font-bold ${color}`}>{score}</span>
            <span className="text-[10px] text-muted-foreground">{label}</span>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ProductModerationPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<ModerationStatus | 'all'>('all');
    const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [sortKey, setSortKey] = useState<keyof ModerationProduct>('submittedAt');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [bulkMenuOpen, setBulkMenuOpen] = useState(false);
    const [products, setProducts] = useState<ModerationProduct[]>(mockModerationProducts);

    const categories = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.category)))], [products]);

    const filtered = useMemo(() => {
        return products
            .filter(p => {
                const q = search.toLowerCase();
                return (
                    (!q || p.name.toLowerCase().includes(q) || p.businessName.toLowerCase().includes(q) || p.sellerName.toLowerCase().includes(q)) &&
                    (statusFilter === 'all' || p.status === statusFilter) &&
                    (riskFilter === 'all' || p.riskLevel === riskFilter) &&
                    (categoryFilter === 'all' || p.category === categoryFilter)
                );
            })
            .sort((a, b) => {
                const av = a[sortKey], bv = b[sortKey];
                if (av == null) return 1; if (bv == null) return -1;
                if (av < bv) return sortDir === 'asc' ? -1 : 1;
                if (av > bv) return sortDir === 'asc' ? 1 : -1;
                return 0;
            });
    }, [products, search, statusFilter, riskFilter, categoryFilter, sortKey, sortDir]);

    // Sort high-risk and flagged to top of pending
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const riskOrder = { high: 0, medium: 1, low: 2 };
            if (statusFilter === 'all' || statusFilter === 'pending') {
                if (a.riskLevel !== b.riskLevel) return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
            }
            return 0;
        });
    }, [filtered, statusFilter]);

    const handleSort = (key: keyof ModerationProduct) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('asc'); }
    };

    const toggleSelect = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selected.size === sorted.length) setSelected(new Set());
        else setSelected(new Set(sorted.map(p => p.id)));
    };

    const handleBulkAction = (action: BulkAction) => {
        const statusMap: Record<BulkAction, ModerationStatus | null> = {
            approve: 'approved',
            reject: 'rejected',
            flag: 'flagged',
            delete: null,
        };
        const newStatus = statusMap[action];
        setProducts(prev => {
            if (newStatus === null) return prev.filter(p => !selected.has(p.id));
            return prev.map(p => selected.has(p.id) ? { ...p, status: newStatus } : p);
        });
        setSelected(new Set());
        setBulkMenuOpen(false);
    };

    const stats = mockModerationStats;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl font-bold text-foreground">Product Moderation</h1>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">Review, approve, and moderate all marketplace product submissions</p>
                </div>
                <Button size="sm" className="gap-2" onClick={() => router.push('/dashboard/products/moderation/analytics')}>
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                </Button>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                    { label: 'Pending Review', value: stats.pendingReview, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Approved Today', value: stats.approvedToday, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
                    { label: 'Rejected Today', value: stats.rejectedToday, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
                    { label: 'Reported', value: stats.reported, icon: Flag, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                    { label: 'High Risk', value: stats.highRisk, icon: ShieldAlert, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">{label}</p>
                            <p className={`text-xl font-bold ${color}`}>{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                {/* Search */}
                <div className="flex-1 min-w-48 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search products, sellers…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                    />
                </div>

                {/* Status */}
                <div className="flex gap-1.5 flex-wrap">
                    {(['all', 'pending', 'approved', 'rejected', 'flagged', 'reported'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize ${statusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:text-foreground'
                                }`}
                        >
                            {s === 'all' ? `All (${products.length})` : `${s} (${products.filter(p => p.status === s).length})`}
                        </button>
                    ))}
                </div>

                {/* Risk */}
                <select
                    value={riskFilter}
                    onChange={e => setRiskFilter(e.target.value as RiskLevel | 'all')}
                    className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                    <option value="all">All Risks</option>
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                </select>

                {/* Category */}
                <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                    {categories.map(c => (
                        <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
                    ))}
                </select>
            </div>

            {/* Bulk actions bar */}
            {selected.size > 0 && (
                <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
                    <span className="text-sm font-semibold text-primary">{selected.size} selected</span>
                    <div className="flex gap-2 ml-2">
                        <button onClick={() => handleBulkAction('approve')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-semibold hover:bg-green-500/20 transition-colors">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => handleBulkAction('reject')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 transition-colors">
                            <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                        <button onClick={() => handleBulkAction('flag')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold hover:bg-orange-500/20 transition-colors">
                            <Flag className="w-3.5 h-3.5" /> Flag
                        </button>
                        <button onClick={() => handleBulkAction('delete')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold hover:bg-rose-500/20 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                    </div>
                    <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors">
                        Clear selection
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">

                {/* Headers */}
                <div className="grid grid-cols-12 px-4 py-3 border-b border-border bg-muted/30 items-center">
                    <div className="col-span-1 flex items-center">
                        <input
                            type="checkbox"
                            checked={selected.size === sorted.length && sorted.length > 0}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-border text-primary accent-primary cursor-pointer"
                        />
                    </div>
                    <button onClick={() => handleSort('name')} className="col-span-3 flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
                        Product <SortIcon col="name" sortKey={String(sortKey)} dir={sortDir} />
                    </button>
                    <button onClick={() => handleSort('status')} className="col-span-2 flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
                        Status <SortIcon col="status" sortKey={String(sortKey)} dir={sortDir} />
                    </button>
                    <button onClick={() => handleSort('riskLevel')} className="col-span-1 flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
                        Risk <SortIcon col="riskLevel" sortKey={String(sortKey)} dir={sortDir} />
                    </button>
                    <button onClick={() => handleSort('price')} className="col-span-1 flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
                        Price <SortIcon col="price" sortKey={String(sortKey)} dir={sortDir} />
                    </button>
                    <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Seller Trust
                    </div>
                    <button onClick={() => handleSort('totalReports')} className="col-span-1 flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
                        Rep. <SortIcon col="totalReports" sortKey={String(sortKey)} dir={sortDir} />
                    </button>
                    <div className="col-span-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-border">
                    {sorted.length === 0 ? (
                        <div className="py-16 text-center text-sm text-muted-foreground">
                            <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            No products match your filters.
                        </div>
                    ) : sorted.map(product => {
                        const sc = statusConfig[product.status];
                        const rc = riskConfig[product.riskLevel];
                        const isSelected = selected.has(product.id);
                        const catColor = categoryColors[product.category] ?? categoryColors.Other;

                        return (
                            <div
                                key={product.id}
                                className={`grid grid-cols-12 px-4 py-3.5 items-center transition-all duration-150 hover:bg-muted/30 ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'} ${product.riskLevel === 'high' ? 'border-l-red-500/60' : ''}`}
                            >
                                {/* Checkbox */}
                                <div className="col-span-1">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleSelect(product.id)}
                                        className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                                    />
                                </div>

                                {/* Product */}
                                <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                                    <div className="w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center flex-shrink-0 text-sm font-black text-muted-foreground">
                                        {product.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold truncate text-foreground leading-tight">{product.name}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="text-[10px] text-muted-foreground truncate">{product.businessName}</span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${catColor}`}>{product.category}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="col-span-2 flex items-center">
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border ${sc.badge}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                        {sc.label}
                                    </span>
                                </div>

                                {/* Risk */}
                                <div className="col-span-1">
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${rc.badge}`}>
                                        {rc.icon} {rc.label}
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="col-span-1">
                                    <span className="text-sm font-semibold text-emerald-400">{formatCurrency(product.price, product.currency)}</span>
                                </div>

                                {/* Trust */}
                                <div className="col-span-2">
                                    <TrustScore score={product.sellerTrustScore} />
                                </div>

                                {/* Reports */}
                                <div className="col-span-1">
                                    <span className={`text-sm font-bold ${product.totalReports > 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                                        {product.totalReports > 0 ? `⚠ ${product.totalReports}` : '—'}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 flex items-center justify-end gap-1">
                                    <button
                                        onClick={() => router.push(`/dashboard/products/moderation/${product.id}`)}
                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                                        title="Review Product"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    {product.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: 'approved' } : p))}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-green-400 hover:bg-green-500/10 transition-colors"
                                                title="Approve"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: 'rejected' } : p))}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                title="Reject"
                                            >
                                                <XCircle className="w-3.5 h-3.5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                        Showing <span className="font-semibold text-foreground">{sorted.length}</span> of{' '}
                        <span className="font-semibold text-foreground">{products.length}</span> products
                    </span>
                    {sorted.some(p => p.riskLevel === 'high') && (
                        <span className="flex items-center gap-1.5 text-xs text-red-400">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            High-risk products shown first
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}