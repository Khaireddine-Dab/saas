'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, TrendingUp, TrendingDown, CheckCircle2, XCircle,
    Flag, AlertTriangle, Shield, Package, BarChart3, Clock,
    ShieldAlert, Star,
} from 'lucide-react';
import { mockModerationProducts, mockModerationStats } from '@/lib/mock-moderation-data';
import { formatNumber } from '@/lib/helpers';

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
    return (
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
        </div>
    );
}

export default function ModerationAnalyticsPage() {
    const router = useRouter();

    const stats = mockModerationStats;
    const products = mockModerationProducts;

    // Category breakdown
    const categoryBreakdown = Object.entries(
        products.reduce((acc, p) => {
            acc[p.category] = (acc[p.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    ).sort((a, b) => b[1] - a[1]);

    // Risk breakdown
    const riskBreakdown = {
        low: products.filter(p => p.riskLevel === 'low').length,
        medium: products.filter(p => p.riskLevel === 'medium').length,
        high: products.filter(p => p.riskLevel === 'high').length,
    };

    // Status breakdown
    const statusBreakdown = {
        pending: products.filter(p => p.status === 'pending').length,
        approved: products.filter(p => p.status === 'approved').length,
        rejected: products.filter(p => p.status === 'rejected').length,
        flagged: products.filter(p => p.status === 'flagged').length,
        reported: products.filter(p => p.status === 'reported').length,
    };

    // Seller trust breakdown
    const sellerTrust = {
        trusted: products.filter(p => p.sellerTrustScore >= 80).length,
        normal: products.filter(p => p.sellerTrustScore >= 50 && p.sellerTrustScore < 80).length,
        risky: products.filter(p => p.sellerTrustScore < 50).length,
    };

    // Top reported products
    const topReported = [...products].sort((a, b) => b.totalReports - a.totalReports).slice(0, 5);

    // High risk products
    const highRiskProducts = products.filter(p => p.riskLevel === 'high').slice(0, 5);

    return (
        <div className="space-y-6 max-w-6xl">

            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        <h1 className="text-xl font-bold text-foreground">Moderation Analytics</h1>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">Platform quality overview and moderation metrics</p>
                </div>
            </div>

            {/* Key metric cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                    { label: 'Pending Review', value: stats.pendingReview, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Approved Today', value: stats.approvedToday, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
                    { label: 'Rejected Today', value: stats.rejectedToday, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
                    { label: 'Reported', value: stats.reported, icon: Flag, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                    { label: 'High Risk', value: stats.highRisk, icon: ShieldAlert, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="bg-card border border-border rounded-xl p-4">
                        <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-2`}>
                            <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <p className={`text-2xl font-black ${color}`}>{value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Status Breakdown */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Shield className="w-4 h-4 text-muted-foreground" /> Status Breakdown
                    </h3>
                    <div className="space-y-2.5">
                        {[
                            { label: 'Pending', value: statusBreakdown.pending, color: 'bg-amber-500', text: 'text-amber-400' },
                            { label: 'Approved', value: statusBreakdown.approved, color: 'bg-green-500', text: 'text-green-400' },
                            { label: 'Rejected', value: statusBreakdown.rejected, color: 'bg-red-500', text: 'text-red-400' },
                            { label: 'Flagged', value: statusBreakdown.flagged, color: 'bg-orange-500', text: 'text-orange-400' },
                            { label: 'Reported', value: statusBreakdown.reported, color: 'bg-rose-500', text: 'text-rose-400' },
                        ].map(({ label, value, color, text }) => (
                            <div key={label} className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">{label}</span>
                                    <span className={`text-xs font-bold ${text}`}>{value}</span>
                                </div>
                                <MiniBar value={value} max={products.length} color={color} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Breakdown */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-muted-foreground" /> Risk Distribution
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Low Risk', value: riskBreakdown.low, color: 'bg-green-500', text: 'text-green-400', pct: Math.round((riskBreakdown.low / products.length) * 100) },
                            { label: 'Medium Risk', value: riskBreakdown.medium, color: 'bg-amber-500', text: 'text-amber-400', pct: Math.round((riskBreakdown.medium / products.length) * 100) },
                            { label: 'High Risk', value: riskBreakdown.high, color: 'bg-red-500', text: 'text-red-400', pct: Math.round((riskBreakdown.high / products.length) * 100) },
                        ].map(({ label, value, color, text, pct }) => (
                            <div key={label} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">{label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold ${text}`}>{value}</span>
                                        <span className="text-[10px] text-muted-foreground">({pct}%)</span>
                                    </div>
                                </div>
                                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                        <span className="text-red-400 font-semibold">{riskBreakdown.high}</span> high-risk products need immediate attention
                    </p>
                </div>

                {/* Seller Trust */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" /> Seller Trust Scores
                    </h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Trusted (80+)', value: sellerTrust.trusted, color: 'bg-green-500', text: 'text-green-400', score: '80–100' },
                            { label: 'Normal (50–79)', value: sellerTrust.normal, color: 'bg-amber-500', text: 'text-amber-400', score: '50–79' },
                            { label: 'Risky (< 50)', value: sellerTrust.risky, color: 'bg-red-500', text: 'text-red-400', score: '0–49' },
                        ].map(({ label, value, color, text, score }) => (
                            <div key={label} className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${color} flex-shrink-0`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">{label}</span>
                                        <span className={`text-sm font-bold ${text}`}>{value}</span>
                                    </div>
                                    <MiniBar value={value} max={products.length} color={color} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 mt-2">
                        <p className="text-xs text-muted-foreground">
                            Trust score decreases when products are rejected or customers report issues. Increases with successful sales and positive reviews.
                        </p>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" /> Products by Category
                    </h3>
                    <div className="space-y-2">
                        {categoryBreakdown.map(([cat, count]) => (
                            <div key={cat} className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">{cat}</span>
                                    <span className="text-xs font-bold text-foreground">{count}</span>
                                </div>
                                <MiniBar value={count} max={products.length} color="bg-primary/60" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Reported */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Flag className="w-4 h-4 text-muted-foreground" /> Most Reported Products
                    </h3>
                    <div className="space-y-2">
                        {topReported.filter(p => p.totalReports > 0).length === 0 ? (
                            <p className="text-xs text-muted-foreground">No reports yet.</p>
                        ) : topReported.filter(p => p.totalReports > 0).map((p, i) => (
                            <div key={p.id} className="flex items-center gap-2.5">
                                <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-foreground truncate">{p.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{p.businessName}</p>
                                </div>
                                <span className="text-xs font-bold text-red-400">{p.totalReports} rep.</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* High Risk Queue */}
                <div className="bg-card border border-red-500/20 rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" /> High-Risk Queue
                    </h3>
                    <div className="space-y-2">
                        {highRiskProducts.length === 0 ? (
                            <p className="text-xs text-muted-foreground">No high-risk products.</p>
                        ) : highRiskProducts.map(p => (
                            <div key={p.id} className="flex items-start gap-2.5 p-2 bg-red-500/5 rounded-lg border border-red-500/10">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-foreground truncate">{p.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{p.riskIndicators.length} risk indicator(s)</p>
                                </div>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize font-semibold ${p.status === 'flagged' ? 'bg-orange-500/10 text-orange-400' :
                                        p.status === 'reported' ? 'bg-rose-500/10 text-rose-400' :
                                            'bg-amber-500/10 text-amber-400'
                                    }`}>{p.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}