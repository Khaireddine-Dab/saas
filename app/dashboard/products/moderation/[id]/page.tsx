'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft, CheckCircle2, XCircle, Flag, Shield, ShieldAlert,
    Star, AlertTriangle, Package, Calendar, TrendingUp, Edit,
    UserX, ExternalLink, BarChart3, MessageSquare, Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockModerationProducts } from '@/lib/mock-moderation-data';
import { ModerationProduct, ModerationStatus } from '@/types/moderation';
import { formatCurrency, formatDate } from '@/lib/helpers';

const statusConfig: Record<ModerationStatus, { label: string; dot: string; badge: string }> = {
    pending: { label: 'Pending', dot: 'bg-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    approved: { label: 'Approved', dot: 'bg-green-500', badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
    rejected: { label: 'Rejected', dot: 'bg-red-500', badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
    flagged: { label: 'Flagged', dot: 'bg-orange-500', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    reported: { label: 'Reported', dot: 'bg-rose-500', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
};

const riskColors = {
    low: { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    medium: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    high: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

const reportReasonLabels: Record<string, string> = {
    fake_product: 'Fake Product',
    misleading_description: 'Misleading Description',
    wrong_price: 'Wrong Price',
    illegal_item: 'Illegal Item',
    spam_listing: 'Spam Listing',
};

function TrustBar({ score }: { score: number }) {
    const color = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';
    const textColor = score >= 80 ? 'text-green-400' : score >= 50 ? 'text-amber-400' : 'text-red-400';
    const label = score >= 80 ? 'Trusted' : score >= 50 ? 'Normal' : 'Risky';
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <span className={`text-2xl font-black ${textColor}`}>{score}</span>
                <span className={`text-sm font-semibold ${textColor}`}>{label}</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
            </div>
        </div>
    );
}

export default function ProductReviewPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params?.id as string;
    const [product, setProduct] = useState<ModerationProduct | undefined>(
        mockModerationProducts.find(p => p.id === productId)
    );
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectDialog, setShowRejectDialog] = useState(false);

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Package className="w-12 h-12 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">Product not found.</p>
                <Button onClick={() => router.back()} variant="outline" size="sm">Go Back</Button>
            </div>
        );
    }

    const sc = statusConfig[product.status];
    const rc = riskColors[product.riskLevel];

    const handleAction = (action: 'approve' | 'reject' | 'flag') => {
        const statusMap = { approve: 'approved', reject: 'rejected', flag: 'flagged' } as const;
        setProduct(prev => prev ? { ...prev, status: statusMap[action] } : prev);
        if (action === 'reject') setShowRejectDialog(false);
    };

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
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-xl font-bold text-foreground truncate">{product.name}</h1>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border ${sc.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {sc.label}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${rc.bg} ${rc.text} ${rc.border}`}>
                            <ShieldAlert className="w-3 h-3" /> {product.riskLevel.charAt(0).toUpperCase() + product.riskLevel.slice(1)} Risk
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Submitted {formatDate(product.submittedAt)} by {product.businessName}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Product Info */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Image placeholder gallery */}
                    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" /> Product Images
                        </h2>
                        <div className="flex gap-3 overflow-x-auto pb-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`w-28 h-28 rounded-lg flex-shrink-0 bg-muted border border-border flex items-center justify-center ${i > product.images.length ? 'opacity-30' : ''}`}>
                                    <span className="text-2xl font-black text-muted-foreground">{product.name.slice(0, 2)}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{product.images.length} image(s) uploaded</p>
                    </div>

                    {/* Product Information */}
                    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
                        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Tag className="w-4 h-4 text-muted-foreground" /> Product Information
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Name', value: product.name },
                                { label: 'Category', value: product.category },
                                { label: 'Price', value: formatCurrency(product.price, product.currency) },
                                { label: 'Stock', value: `${product.stock} units` },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <p className="text-xs text-muted-foreground">{label}</p>
                                    <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Description</p>
                            <p className="text-sm text-foreground leading-relaxed bg-muted/30 rounded-lg p-3">{product.description}</p>
                        </div>
                    </div>

                    {/* Risk Indicators */}
                    {product.riskIndicators.length > 0 && (
                        <div className="bg-card border border-red-500/20 rounded-xl p-4 space-y-3">
                            <h2 className="text-sm font-semibold text-red-400 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Risk Indicators
                            </h2>
                            <div className="space-y-2">
                                {product.riskIndicators.map((ri, i) => {
                                    const color = ri.severity === 'high' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                                    return (
                                        <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${color}`}>
                                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                                            <span className="text-xs font-semibold">{ri.label}</span>
                                            <span className="ml-auto text-xs capitalize opacity-70">{ri.severity}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Reports */}
                    {product.reports.length > 0 && (
                        <div className="bg-card border border-rose-500/20 rounded-xl p-4 space-y-3">
                            <h2 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
                                <Flag className="w-4 h-4" /> User Reports ({product.totalReports})
                            </h2>
                            <div className="space-y-2">
                                {product.reports.map(report => (
                                    <div key={report.id} className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-rose-500/5 border border-rose-500/10">
                                        <MessageSquare className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-rose-300">{reportReasonLabels[report.reason] ?? report.reason}</p>
                                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                                Reported by {report.reportedBy} · {formatDate(report.reportedAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Rejection info */}
                    {product.status === 'rejected' && product.rejectionReason && (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                            <p className="text-xs text-red-400 font-semibold mb-1">Rejection Reason</p>
                            <p className="text-sm text-foreground">{product.rejectionReason}</p>
                            {product.reviewedBy && (
                                <p className="text-xs text-muted-foreground mt-2">By {product.reviewedBy} on {formatDate(product.reviewedAt!)}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: Sidebar */}
                <div className="space-y-4">

                    {/* Admin Actions */}
                    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Shield className="w-4 h-4 text-muted-foreground" /> Admin Actions
                        </h2>
                        <div className="space-y-2">
                            <button
                                onClick={() => handleAction('approve')}
                                disabled={product.status === 'approved'}
                                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-semibold hover:bg-green-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <CheckCircle2 className="w-4 h-4" /> Approve Product
                            </button>
                            <button
                                onClick={() => setShowRejectDialog(true)}
                                disabled={product.status === 'rejected'}
                                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-semibold hover:bg-red-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <XCircle className="w-4 h-4" /> Reject Product
                            </button>
                            <button
                                onClick={() => handleAction('flag')}
                                disabled={product.status === 'flagged'}
                                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 text-sm font-semibold hover:bg-orange-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Flag className="w-4 h-4" /> Flag for Review
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted text-foreground border border-border text-sm font-semibold hover:bg-muted/80 transition-colors">
                                <Edit className="w-4 h-4" /> Edit Product
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-sm font-semibold hover:bg-rose-500/20 transition-colors">
                                <UserX className="w-4 h-4" /> Suspend Seller
                            </button>
                        </div>
                    </div>

                    {/* Seller Info */}
                    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-muted-foreground" /> Seller Information
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-muted-foreground">Business</p>
                                <p className="text-sm font-semibold text-foreground">{product.businessName}</p>
                                <p className="text-xs text-muted-foreground">{product.sellerName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-2">Trust Score</p>
                                <TrustBar score={product.sellerTrustScore} />
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div className="bg-muted/40 rounded-lg p-2.5 text-center">
                                    <p className="text-lg font-bold text-foreground">{product.sellerTotalProducts}</p>
                                    <p className="text-[10px] text-muted-foreground">Products</p>
                                </div>
                                <div className="bg-muted/40 rounded-lg p-2.5 text-center">
                                    <p className="text-lg font-bold text-foreground flex items-center justify-center gap-0.5">
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{product.averageRating.toFixed(1)}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">Rating</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Member Since</p>
                                <p className="text-sm font-semibold text-foreground">{formatDate(product.sellerRegisteredAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Product Metrics */}
                    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-muted-foreground" /> Product Metrics
                        </h2>
                        <div className="space-y-2">
                            {[
                                { label: 'Total Sales', value: product.totalSales.toLocaleString() },
                                { label: 'Average Rating', value: `${product.averageRating.toFixed(1)} / 5.0` },
                                { label: 'Total Reports', value: product.totalReports, alert: product.totalReports > 0 },
                            ].map(({ label, value, alert }) => (
                                <div key={label} className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">{label}</span>
                                    <span className={`text-sm font-semibold ${alert ? 'text-red-400' : 'text-foreground'}`}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject Dialog */}
            {showRejectDialog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-400" /> Reject Product
                        </h3>
                        <p className="text-sm text-muted-foreground">Please provide a reason for rejecting <strong className="text-foreground">{product.name}</strong>.</p>
                        <textarea
                            value={rejectionReason}
                            onChange={e => setRejectionReason(e.target.value)}
                            placeholder="e.g. Counterfeit product, violates marketplace policy…"
                            rows={3}
                            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
                        />
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
                            <button
                                onClick={() => handleAction('reject')}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}