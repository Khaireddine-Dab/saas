'use client';

import { useState, useEffect } from 'react';
import {
  Search, Plus, Filter, MoreVertical, Star, MapPin,
  Trash2, Ban, Package, ShieldCheck, X, Mail, Phone,
  Globe, TrendingUp, Calendar, Clock, ChevronRight,
  ExternalLink, ShieldBan, ShieldAlert, BadgeCheck,
  DollarSign, BarChart2, AlertTriangle, Building2, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MerchantVerification } from '@/components/admin/merchant-verification';
import { storesApi } from '@/lib/api';
import { useProducts } from '@/hooks/useProducts';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Merchant {
  id: string;
  storeName: string;
  ownerName: string;
  ownerEmail: string;
  businessType: string;
  status: 'active' | 'verified' | 'pending' | 'suspended' | 'banned' | 'rejected';
  rating: string;
  reviewCount: number;
  totalOrders: number;
  totalEarnings: number;
  accountBalance: number;
  productCount: number;
  flaggedProducts: number;
  createdAt: string;
  joinedAt: string;
  rne: string;
  registrationNumber: string;
  address: string;
}

// ─── Backend Data Mapper ──────────────────────────────────────────────────────
const mapBackendStore = async (store: any, index: number): Promise<Merchant> => {
  let productCount = 0;
  try {
    const products = await storesApi.getProducts(store.id);
    productCount = products?.length || 0;
  } catch (err) {
    console.warn(`Failed to get products for store ${store.id}:`, err);
  }

  // Map backend status (PENDING/PUBLISHED/REJECTED) to UI status
  let status: Merchant['status'] = 'pending';
  switch (store.status) {
    case 'PUBLISHED': status = 'active'; break;
    case 'PENDING': status = 'pending'; break;
    case 'REJECTED': status = 'rejected'; break;
    default: status = 'pending';
  }

  return {
    id: store.id.toString(),
    storeName: store.name || 'Sans nom',
    ownerName: store.owner_details?.full_name || 'Inconnu',
    ownerEmail: store.owner_details?.email || store.email || '',
    businessType: store.description || 'Non défini',
    status,
    rating: store.rating_average ? parseFloat(store.rating_average).toFixed(1) : '0.0',
    reviewCount: store.total_reviews || 0,
    totalOrders: store.total_orders || 0,
    totalEarnings: 0, // Pas disponible dans le backend
    accountBalance: 0, // Pas disponible dans le backend
    productCount,
    flaggedProducts: 0, // Pas disponible dans le backend
    createdAt: new Date(store.created_at).toLocaleDateString(),
    joinedAt: new Date(store.created_at).toLocaleDateString(),
    rne: store.rne || 'N/A',
    registrationNumber: `REG-${store.id}`,
    address: store.address || `${store.city || ''}, Tunisia`,
  };
};

// ─── Config ───────────────────────────────────────────────────────────────────
const statusConfig: Record<Merchant['status'], { label: string; dot: string; badge: string }> = {
  active:    { label: 'Active',    dot: 'bg-green-500',  badge: 'bg-green-500/15 text-green-400 border-green-500/25' },
  verified:  { label: 'Verified',  dot: 'bg-indigo-500', badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25' },
  pending:   { label: 'Pending',   dot: 'bg-yellow-500', badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25' },
  suspended: { label: 'Suspended', dot: 'bg-orange-500', badge: 'bg-orange-500/15 text-orange-400 border-orange-500/25' },
  banned:    { label: 'Banned',    dot: 'bg-red-500',    badge: 'bg-red-500/15 text-red-400 border-red-500/25' },
  rejected:  { label: 'Rejected',  dot: 'bg-rose-500',   badge: 'bg-rose-500/15 text-rose-400 border-rose-500/25' },
};

const categoryColors: Record<string, string> = {
  restaurant: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  grocery:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pharmacy:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const panelGradients = [
  'from-indigo-500/20 to-purple-500/20 border-indigo-500/25 text-indigo-300',
  'from-blue-500/20 to-cyan-500/20 border-blue-500/25 text-blue-300',
  'from-emerald-500/20 to-teal-500/20 border-emerald-500/25 text-emerald-300',
  'from-orange-500/20 to-amber-500/20 border-orange-500/25 text-orange-300',
  'from-rose-500/20 to-pink-500/20 border-rose-500/25 text-rose-300',
];

const getPanelGradient = (id: string) =>
  panelGradients[parseInt(id.replace('merchant-', '')) % panelGradients.length];

const getInitials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

// ─── Product Manager Modal ────────────────────────────────────────────────────
function ProductManagerModal({
  merchantId,
  merchantName,
  onClose,
}: {
  merchantId: string;
  merchantName: string;
  onClose: () => void;
}) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const storeId = parseInt(merchantId);
        const data = await storesApi.getProducts(storeId);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors du chargement des produits';
        setError(message);
        console.error('Erreur:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [merchantId]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">
              Produits — {merchantName}
            </h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Chargement des produits...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">Erreur: {error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground">Aucun produit trouvé pour ce marchand</p>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-sm">Produits ({products.length})</h3>
              {products.map((p: any) => (
                <div key={p.id} className="border border-border rounded-lg p-3 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{p.name || 'Sans titre'}</p>
                    <div className="flex gap-2 mt-1 text-xs">
                      <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">{p.category || 'Général'}</span>
                      <span className="text-muted-foreground">{parseFloat(p.price || 0).toFixed(2)} TND</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors" title="Voir détails">
                      <Package className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors" title="Supprimer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-muted/30 flex justify-end">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </div>
      </Card>
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function MerchantDetailPanel({
  merchant, onClose, onVerify, onManageProducts, onStatusChange,
}: {
  merchant: Merchant;
  onClose: () => void;
  onVerify: (id: string) => void;
  onManageProducts: (id: string) => void;
  onStatusChange: (id: string, status: Merchant['status']) => void;
}) {
  const sc       = statusConfig[merchant.status];
  const gradient = getPanelGradient(merchant.id);
  const idNum    = merchant.id.replace('merchant-', '').padStart(4, '0');

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 fade-in duration-200">

      {/* ── Quick moderation bar ── */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Merchant #{idNum}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Status + quick actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {sc.label}
          </span>
          <div className="flex items-center gap-1.5 ml-auto">
            {merchant.status === 'pending' && (
              <button
                onClick={() => onVerify(merchant.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 text-[11px] font-semibold transition-all"
              >
                <BadgeCheck className="w-3 h-3" /> Verify
              </button>
            )}
            {merchant.status !== 'suspended' && merchant.status !== 'banned' && (
              <button
                onClick={() => onStatusChange(merchant.id, 'suspended')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 text-[11px] font-semibold transition-all"
              >
                <ShieldAlert className="w-3 h-3" /> Suspend
              </button>
            )}
            {merchant.status !== 'banned' ? (
              <button
                onClick={() => onStatusChange(merchant.id, 'banned')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-[11px] font-semibold transition-all"
              >
                <ShieldBan className="w-3 h-3" /> Block
              </button>
            ) : (
              <button
                onClick={() => onStatusChange(merchant.id, 'active')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 text-[11px] font-semibold transition-all"
              >
                <ShieldCheck className="w-3 h-3" /> Unblock
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">

        {/* 1. Identity */}
        <div className="px-4 py-4 border-b border-gray-800">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} border-2 flex items-center justify-center flex-shrink-0 shadow-md`}>
              <span className="text-base font-black">{getInitials(merchant.storeName)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white truncate">{merchant.storeName}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                <span className="text-gray-600">Owner:</span> {merchant.ownerName}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${categoryColors[merchant.businessType] ?? 'bg-gray-700 text-gray-300 border-gray-600'}`}>
                  {merchant.businessType}
                </span>
                {merchant.flaggedProducts > 0 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    {merchant.flaggedProducts} flagged
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Contact */}
        <div className="px-4 py-3.5 border-b border-gray-800">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2.5">Contact</p>
          <div className="space-y-2">
            {[
              { icon: Mail,  value: merchant.ownerEmail,    href: `mailto:${merchant.ownerEmail}` },
              { icon: Phone, value: '+216 50 704 630',       href: 'tel:+21650704630' },
              { icon: MapPin,value: merchant.address,        href: undefined },
              { icon: Globe, value: `${merchant.storeName.toLowerCase().replace(/\s+/g,'')+'.tn'}`, href: '#' },
            ].map(({ icon: Icon, value, href }) => (
              <div key={value} className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-gray-800 border border-gray-700/40 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3 h-3 text-gray-400" />
                </div>
                {href ? (
                  <a href={href} className="text-xs text-gray-300 hover:text-white transition-colors truncate">{value}</a>
                ) : (
                  <span className="text-xs text-gray-300 truncate">{value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Business Insights */}
        <div className="px-4 py-3.5 border-b border-gray-800">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2.5">Insights</p>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { icon: TrendingUp, label: 'Revenue',  value: `$${merchant.totalEarnings.toLocaleString()}`, color: 'text-emerald-400', bg: 'bg-emerald-500/8' },
              { icon: BarChart2,  label: 'Orders',   value: merchant.totalOrders,                          color: 'text-blue-400',    bg: 'bg-blue-500/8' },
              { icon: Package,    label: 'Products', value: merchant.productCount,                         color: 'text-purple-400',  bg: 'bg-purple-500/8' },
              { icon: Star,       label: 'Rating',   value: `${merchant.rating} ★`,                       color: 'text-amber-400',   bg: 'bg-amber-500/8' },
              { icon: DollarSign, label: 'Balance',  value: `$${merchant.accountBalance.toLocaleString()}`, color: 'text-cyan-400',  bg: 'bg-cyan-500/8' },
              { icon: Calendar,   label: 'Joined',   value: merchant.joinedAt,                             color: 'text-gray-400',    bg: 'bg-gray-700/30' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className={`${bg} border border-white/[0.04] rounded-xl px-3 py-2.5`}>
                <div className="flex items-center gap-1 mb-1">
                  <Icon className={`w-3 h-3 ${color}`} />
                  <p className="text-[9px] text-gray-600 font-bold uppercase tracking-wide">{label}</p>
                </div>
                <p className={`text-xs font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Registration IDs */}
        <div className="px-4 py-3.5 border-b border-gray-800">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2.5">Registration</p>
          {[
            { label: 'RNE',        value: merchant.rne },
            { label: 'Reg Number', value: merchant.registrationNumber },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-1">
              <span className="text-[11px] text-gray-500">{label}</span>
              <span className="text-[11px] font-mono text-gray-300 bg-gray-800 border border-gray-700/50 px-2 py-0.5 rounded">{value}</span>
            </div>
          ))}
        </div>

        {/* 4. Admin Actions */}
        <div className="px-4 py-4 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2.5">Actions</p>

          <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-bold transition-all group shadow-lg shadow-indigo-900/30">
            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1 text-left">Visit Profile</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs font-bold transition-all group shadow-lg shadow-blue-900/30">
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1 text-left">Contact Owner</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => { onManageProducts(merchant.id); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700/60 text-gray-300 hover:text-white text-xs font-bold transition-all group active:scale-[0.98]"
          >
            <Package className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1 text-left">Manage Products</span>
            {merchant.flaggedProducts > 0 && (
              <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full">
                {merchant.flaggedProducts}
              </span>
            )}
            <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-gray-700/80 bg-transparent hover:bg-red-500/10 hover:border-red-500/30 text-red-400 hover:text-red-300 text-xs font-bold transition-all group active:scale-[0.98]">
            <ShieldBan className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1 text-left">
              {merchant.status === 'banned' ? 'Unblock Business' : 'Block Business'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="h-3" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MerchantsPage() {
  const [merchants,            setMerchants]            = useState<Merchant[]>([]);
  const [loading,              setLoading]              = useState(true);
  const [error,                setError]                = useState<string | null>(null);
  const [searchQuery,          setSearchQuery]          = useState('');
  const [statusFilter,         setStatusFilter]         = useState<string | undefined>();
  const [selectedMerchantId,   setSelectedMerchantId]   = useState<string | null>(null);
  const [panelMerchantId,      setPanelMerchantId]      = useState<string | null>(null);
  const [showProductManager,   setShowProductManager]   = useState(false);
  const [showVerificationModal,setShowVerificationModal]= useState(false);
  const [actionLoading,        setActionLoading]        = useState<string | null>(null);

  // Charger les merchant au montage du composant
  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await storesApi.getAll();
      
      // Mapper les données du backend
      const mapped = await Promise.all(
        data.map((store: any, i: number) => mapBackendStore(store, i))
      );
      
      setMerchants(mapped);
    } catch (err: any) {
      const errorMsg = err.message || 'Erreur lors du chargement des marchands';
      setError(errorMsg);
      console.error('Error fetching merchants:', err);
      // Toast utile si vous avez sonner disponible
    } finally {
      setLoading(false);
    }
  };

  const filteredMerchants = merchants.filter(m => {
    const q = searchQuery.toLowerCase();
    const matchesSearch  = m.storeName.toLowerCase().includes(q) || m.ownerName.toLowerCase().includes(q);
    const matchesStatus  = !statusFilter || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const panelMerchant    = merchants.find(m => m.id === panelMerchantId) ?? null;
  const selectedMerchant = merchants.find(m => m.id === selectedMerchantId);

  const handleManageProducts    = (id: string) => { setSelectedMerchantId(id); setShowProductManager(true); };
  const handleOpenVerification  = (id: string) => { setSelectedMerchantId(id); setShowVerificationModal(true); };
  const handleRowClick          = (id: string) => setPanelMerchantId(p => p === id ? null : id);
  const handleStatusChange      = (id: string, status: Merchant['status']) =>
    setMerchants(prev => prev.map(m => m.id === id ? { ...m, status } : m));

  const handleApproveKYC = async () => {
    if (!selectedMerchantId) return;
    setActionLoading(selectedMerchantId);
    try {
      const id = parseInt(selectedMerchantId);
      await storesApi.validate(id);
      // Mettre à jour l'état local
      setMerchants(prev => prev.map(m => m.id === selectedMerchantId ? { ...m, status: 'verified' } : m));
      setShowVerificationModal(false);
      setSelectedMerchantId(null);
      // Toast: toast.success('Merchant approved successfully');
    } catch (err: any) {
      console.error('Error approving merchant:', err);
      // Toast: toast.error(err.message || 'Error approving merchant');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectKYC = async (reason: string) => {
    if (!selectedMerchantId) return;
    setActionLoading(selectedMerchantId);
    try {
      const id = parseInt(selectedMerchantId);
      await storesApi.reject(id);
      // Mettre à jour l'état local
      setMerchants(prev => prev.map(m => m.id === selectedMerchantId ? { ...m, status: 'rejected' } : m));
      setShowVerificationModal(false);
      setSelectedMerchantId(null);
      // Toast: toast.success('Merchant rejected successfully');
    } catch (err: any) {
      console.error('Error rejecting merchant:', err);
      // Toast: toast.error(err.message || 'Error rejecting merchant');
    } finally {
      setActionLoading(null);
    }
  };

  const kycData = selectedMerchant ? {
    merchantId: selectedMerchant.id, businessName: selectedMerchant.storeName,
    businessType: selectedMerchant.businessType as any,
    rne: selectedMerchant.rne, registrationNumber: selectedMerchant.registrationNumber,
    ownerName: selectedMerchant.ownerName, ownerEmail: selectedMerchant.ownerEmail,
    ownerPhone: '+216-50-704-630',
    businessAddress: { street: '123 Business St', city: 'Tunis', state: 'Tunis', postalCode: '1000', country: 'Tunisia' },
    bankAccount: { accountName: selectedMerchant.storeName, accountNumber: 'TN5910006035183598478831', bankName: 'Banque de Tunisie', ifscCode: 'BT001234' },
    documents: [
      { id: 'doc-1', type: 'business_license' as const, fileName: 'trade_license.pdf', fileUrl: '#', uploadedAt: new Date(), verificationStatus: 'pending' as const },
      { id: 'doc-2', type: 'tax_id' as const, fileName: 'rne_cert.pdf', fileUrl: '#', uploadedAt: new Date(), verificationStatus: 'pending' as const },
    ],
    kycStatus: 'pending' as const,
  } : null;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Merchant Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage and monitor all marketplace merchants</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Add Merchant
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <p className="text-destructive text-sm font-medium">{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={fetchMerchants}>
            Retry
          </Button>
        </Card>
      )}

      {/* Loading State */}
      {loading ? (
        <Card className="p-12 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading merchants...</p>
        </Card>
      ) : ( <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Merchants', value: merchants.length,                                    sub: '+5 this month',   color: 'text-foreground',  subColor: 'text-green-500' },
          { label: 'Active',          value: merchants.filter(m=>m.status==='active').length,     sub: 'Actively selling', color: 'text-green-500',   subColor: 'text-muted-foreground' },
          { label: 'Commission',      value: '$125,400',                                          sub: 'This month',      color: 'text-foreground',  subColor: 'text-muted-foreground' },
          { label: 'Avg Rating',      value: '4.3 ★',                                            sub: `${merchants.reduce((s,m)=>s+m.reviewCount,0)} reviews`, color: 'text-amber-500', subColor: 'text-muted-foreground' },
        ].map(({ label, value, sub, color, subColor }) => (
          <Card key={label} className="p-4">
            <div className="text-xs text-muted-foreground font-medium">{label}</div>
            <div className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</div>
            <div className={`text-[11px] mt-1 ${subColor}`}>{sub}</div>
          </Card>
        ))}
      </div>

      {/* Filter bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search merchants..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['','active','verified','pending','suspended','banned','rejected'] as const).map(s => (
              <button key={s}
                onClick={() => setStatusFilter(s || undefined)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize ${
                  (statusFilter ?? '') === s
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40'
                }`}
              >
                {s === '' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table + Panel */}
      <div className="flex gap-4 items-start">

        {/* Table */}
        <div className="flex-1 min-w-0">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border">
                  <tr>
                    {['Store','Owner','Type','Status','Rating','Orders','Products','Earnings','Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredMerchants.map(merchant => {
                    const isOpen = panelMerchantId === merchant.id;
                    const sc     = statusConfig[merchant.status];
                    return (
                      <tr
                        key={merchant.id}
                        onClick={() => handleRowClick(merchant.id)}
                        className={`border-b cursor-pointer transition-all duration-150 select-none ${
                          isOpen
                            ? 'bg-indigo-500/10 border-l-[3px] border-l-indigo-500'
                            : 'hover:bg-muted/40 border-l-[3px] border-l-transparent'
                        }`}
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${getPanelGradient(merchant.id)} border flex items-center justify-center flex-shrink-0`}>
                              <span className="text-[10px] font-black">{getInitials(merchant.storeName)}</span>
                            </div>
                            <div>
                              <p className={`text-sm font-semibold leading-tight ${isOpen ? 'text-indigo-300' : 'text-foreground'}`}>{merchant.storeName}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">#{merchant.id.replace('merchant-','').padStart(4,'0')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm text-foreground">{merchant.ownerName}</p>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{merchant.ownerEmail}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${categoryColors[merchant.businessType] ?? ''}`}>
                            {merchant.businessType}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border ${sc.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span className="font-semibold text-sm">{merchant.rating}</span>
                            <span className="text-xs text-muted-foreground">({merchant.reviewCount})</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-sm">{merchant.totalOrders}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm">{merchant.productCount}</span>
                            {merchant.flaggedProducts > 0 && (
                              <span className="text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-full">
                                {merchant.flaggedProducts}⚑
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-sm text-emerald-400">${merchant.totalEarnings.toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground">Bal: ${merchant.accountBalance.toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            {merchant.status === 'pending' && (
                              <button onClick={() => handleOpenVerification(merchant.id)} className="p-1.5 hover:bg-yellow-500/10 rounded-lg text-yellow-500 transition-colors" title="Verify">
                                <ShieldCheck className="w-4 h-4" />
                              </button>
                            )}
                            <button onClick={() => handleManageProducts(merchant.id)} className="p-1.5 hover:bg-primary/10 rounded-lg text-primary transition-colors" title="Products">
                              <Package className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRowClick(merchant.id)}
                              className={`p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-muted text-muted-foreground'}`}
                              title="View Details"
                            >
                              <MoreVertical className="w-4 h-4" />
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
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredMerchants.length}</span> of{' '}
                <span className="font-semibold text-foreground">{merchants.length}</span> merchants
                {panelMerchant && (
                  <span className="ml-2 text-indigo-400 animate-in fade-in duration-200">
                    — viewing <strong>{panelMerchant.storeName}</strong>
                  </span>
                )}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        {panelMerchant && (
          <div
            className="w-72 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl"
            style={{ background: '#0f1117', border: '1px solid #1e2330' }}
          >
            <MerchantDetailPanel
              merchant={panelMerchant}
              onClose={() => setPanelMerchantId(null)}
              onVerify={handleOpenVerification}
              onManageProducts={handleManageProducts}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {showVerificationModal && kycData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowVerificationModal(false)} />
          <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold">Merchant Verification</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowVerificationModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <MerchantVerification kyc={kycData as any} onApprove={handleApproveKYC} onReject={handleRejectKYC} />
            </div>
          </Card>
        </div>
      )}

      {/* Product Management Modal */}
      {showProductManager && selectedMerchantId && (
        <ProductManagerModal
          merchantId={selectedMerchantId}
          merchantName={merchants.find(m => m.id === selectedMerchantId)?.storeName || ''}
          onClose={() => { setShowProductManager(false); setSelectedMerchantId(null); }}
        />
      )}
      </> )}
    </div>
  );
}