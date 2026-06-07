'use client';

import { useEffect, useState } from 'react';
import { Download, Filter, Plus, Search, Tag, X, Edit, Trash2, Calendar, ShoppingBag, Store, AlertCircle } from 'lucide-react';
import { usePromotions } from '@/hooks/usePromotions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { storesApi, itemsApi } from '@/lib/api';
import { toast } from 'sonner';

interface PromotionFormData {
  store: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'text';
  discount_percent: string;
  discount_text: string;
  valid_from: string;
  valid_until: string;
  active: boolean;
  apply_to_all: boolean;
  item: string;
}

export default function PromotionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>(''); // '', 'true', 'false'
  
  // Hook for CRUD and statistics
  const {
    promotions,
    statistics,
    isLoading,
    error,
    createPromotion,
    updatePromotion,
    deletePromotion
  } = usePromotions({
    search: searchQuery,
    active: activeFilter === '' ? undefined : activeFilter === 'true'
  });

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState<number | null>(null);
  
  // Backend data lists
  const [stores, setStores] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);

  // Form states
  const [formData, setFormData] = useState<PromotionFormData>({
    store: '',
    title: '',
    description: '',
    discountType: 'percentage',
    discount_percent: '',
    discount_text: '',
    valid_from: '',
    valid_until: '',
    active: true,
    apply_to_all: true,
    item: '',
  });

  // Load stores list for selection
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoadingStores(true);
        const data = (await storesApi.getAll()) as any;
        setStores(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error('Failed to load stores:', err);
        toast.error('Failed to load stores list');
      } finally {
        setLoadingStores(false);
      }
    };
    fetchStores();
  }, []);

  // Load items list when store selection changes in form
  useEffect(() => {
    const fetchItemsForStore = async () => {
      if (!formData.store) {
        setItems([]);
        return;
      }
      try {
        setLoadingItems(true);
        const data = (await itemsApi.getByStore(Number(formData.store))) as any;
        setItems(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error('Failed to load items for store:', err);
        toast.error('Failed to load items list');
      } finally {
        setLoadingItems(false);
      }
    };
    fetchItemsForStore();
  }, [formData.store]);

  const handleOpenCreate = () => {
    setEditingPromoId(null);
    setFormData({
      store: stores[0]?.id?.toString() || '',
      title: '',
      description: '',
      discountType: 'percentage',
      discount_percent: '',
      discount_text: '',
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: true,
      apply_to_all: true,
      item: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (promo: any) => {
    setEditingPromoId(promo.id);
    setFormData({
      store: promo.store?.toString() || '',
      title: promo.title || '',
      description: promo.description || '',
      discountType: promo.discount_percent ? 'percentage' : 'text',
      discount_percent: promo.discount_percent ? String(promo.discount_percent) : '',
      discount_text: promo.discount_text || '',
      valid_from: promo.valid_from || '',
      valid_until: promo.valid_until || '',
      active: !!promo.active,
      apply_to_all: !!promo.apply_to_all,
      item: promo.item?.toString() || '',
    });
    setShowModal(true);
  };

  const handleSavePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.store) {
      toast.error('Please select a store');
      return;
    }
    if (!formData.title) {
      toast.error('Please enter a promotion title');
      return;
    }
    if (formData.discountType === 'percentage' && !formData.discount_percent) {
      toast.error('Please enter discount percentage');
      return;
    }
    if (formData.discountType === 'text' && !formData.discount_text) {
      toast.error('Please enter custom discount text');
      return;
    }
    if (!formData.apply_to_all && !formData.item) {
      toast.error('Please select a target item');
      return;
    }
    if (!formData.valid_from || !formData.valid_until) {
      toast.error('Please select valid start and end dates');
      return;
    }
    if (new Date(formData.valid_from) >= new Date(formData.valid_until)) {
      toast.error('Start date must be before end date');
      return;
    }

    const payload: any = {
      store: Number(formData.store),
      title: formData.title,
      description: formData.description || null,
      discount_percent: formData.discountType === 'percentage' ? Number(formData.discount_percent) : null,
      discount_text: formData.discountType === 'text' ? formData.discount_text : null,
      valid_from: formData.valid_from,
      valid_until: formData.valid_until,
      active: formData.active,
      apply_to_all: formData.apply_to_all,
      item: formData.apply_to_all ? null : Number(formData.item),
    };

    try {
      if (editingPromoId) {
        await updatePromotion(editingPromoId, payload);
        toast.success('Promotion updated successfully');
      } else {
        await createPromotion(payload);
        toast.success('Promotion created successfully');
      }
      setShowModal(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to save promotion');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await deletePromotion(id);
        toast.success('Promotion deleted successfully');
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to delete promotion');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Promotion Management</h1>
          <p className="text-muted-foreground mt-1">Manage discounts, offers, and storewide sales campaign</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleOpenCreate} id="btn-create-promotion" className="bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" />
            Create Promotion
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border border-border/60 bg-card hover:shadow-md transition-all">
          <div className="text-sm font-medium text-muted-foreground">Total Campaigns</div>
          <div className="text-3xl font-bold text-foreground mt-2">{statistics.total_promotions}</div>
          <div className="text-xs text-muted-foreground mt-1">All promotional offers</div>
        </Card>
        <Card className="p-5 border border-border/60 bg-card hover:shadow-md transition-all">
          <div className="text-sm font-medium text-muted-foreground">Active now</div>
          <div className="text-3xl font-bold text-green-500 mt-2">{statistics.active_promotions}</div>
          <div className="text-xs text-muted-foreground mt-1">Currently running on stores</div>
        </Card>
        <Card className="p-5 border border-border/60 bg-card hover:shadow-md transition-all">
          <div className="text-sm font-medium text-muted-foreground">Upcoming</div>
          <div className="text-3xl font-bold text-primary mt-2">{statistics.upcoming_promotions}</div>
          <div className="text-xs text-muted-foreground mt-1">Scheduled for future</div>
        </Card>
        <Card className="p-5 border border-border/60 bg-card hover:shadow-md transition-all">
          <div className="text-sm font-medium text-muted-foreground">Expired</div>
          <div className="text-3xl font-bold text-muted-foreground mt-2">{statistics.expired_promotions}</div>
          <div className="text-xs text-muted-foreground mt-1">Validity dates elapsed</div>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 border border-border/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              id="input-promotion-search"
              placeholder="Search by title, description or store name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 border-border/60"
            />
          </div>
          <div className="flex gap-2">
            <select
              id="select-promotion-status-filter"
              value={activeFilter}
              onChange={e => setActiveFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border/60 text-sm bg-background text-foreground hover:bg-muted transition-colors outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">All Statuses</option>
              <option value="true">Active Campaigns</option>
              <option value="false">Inactive / Suspended</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 border border-destructive/20 bg-destructive/10 rounded-lg text-destructive">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Promotions Table */}
      <Card className="border border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Loading promotions...</span>
            </div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Promotion</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Store</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Discount</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Scope</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Validity Period</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {promotions.length > 0 ? (
                  promotions.map(promo => (
                    <tr key={promo.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-2.5">
                          <Tag className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                          <div>
                            <span className="font-semibold text-foreground text-sm block">{promo.title}</span>
                            {promo.description && (
                              <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-xs">{promo.description}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Store className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{promo.store_details?.name || `Store #${promo.store}`}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-foreground">
                          {promo.discount_display || (promo.discount_percent ? `${promo.discount_percent}% off` : promo.discount_text)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {promo.apply_to_all ? (
                          <span className="text-primary/95 bg-primary/10 px-2 py-0.5 rounded text-xs font-semibold">Storewide</span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3" />
                            <span className="text-xs max-w-[120px] truncate" title={promo.item_details?.name || `Item #${promo.item}`}>
                              {promo.item_details?.name || `Item #${promo.item}`}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {promo.valid_from ? new Date(promo.valid_from).toLocaleDateString() : '—'}
                            {' - '}
                            {promo.valid_until ? new Date(promo.valid_until).toLocaleDateString() : '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {promo.is_active ? (
                          <Badge className="bg-green-500/15 text-green-500 border border-green-500/25 hover:bg-green-500/20">Active</Badge>
                        ) : promo.is_upcoming ? (
                          <Badge className="bg-blue-500/15 text-blue-500 border border-blue-500/25 hover:bg-blue-500/20">Scheduled</Badge>
                        ) : promo.is_expired ? (
                          <Badge className="bg-muted text-muted-foreground border border-border/80 hover:bg-muted/80">Expired</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground bg-muted/40">Inactive</Badge>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(promo)} className="hover:bg-muted hover:text-foreground">
                            <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(promo.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground text-sm">
                      No promotions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <Card className="w-full max-w-xl max-h-[90vh] flex flex-col border border-border/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {editingPromoId ? 'Edit Promotion Campaign' : 'Create Promotion Campaign'}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure discount scope, amounts, and validity dates
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSavePromotion} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* Store Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Target Store <span className="text-destructive">*</span>
                </label>
                <select
                  required
                  value={formData.store}
                  disabled={loadingStores}
                  onChange={(e) => setFormData({ ...formData, store: e.target.value, item: '' })}
                  className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="" disabled>Select a store</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title & Description */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Campaign Title <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g., Summer Sale, Eid Special Offer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="border-border/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Description
                  </label>
                  <Textarea
                    placeholder="Provide details about this promotional offer..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="h-16 resize-none border-border/60"
                  />
                </div>
              </div>

              {/* Discount Options */}
              <div className="border border-border/60 rounded-lg p-3 bg-muted/10">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/40">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Discount Structure <span className="text-destructive">*</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, discountType: 'percentage' })}
                      className={`text-xs px-2.5 py-1 rounded transition-colors ${
                        formData.discountType === 'percentage'
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      Percentage (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, discountType: 'text' })}
                      className={`text-xs px-2.5 py-1 rounded transition-colors ${
                        formData.discountType === 'text'
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      Custom Text
                    </button>
                  </div>
                </div>

                {formData.discountType === 'percentage' ? (
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Discount Percentage (%)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="e.g., 20"
                      value={formData.discount_percent}
                      onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })}
                      className="border-border/60"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Discount Display Description
                    </label>
                    <Input
                      placeholder="e.g., Buy 1 Get 1 Free, Free Fries with Burger"
                      value={formData.discount_text}
                      onChange={(e) => setFormData({ ...formData, discount_text: e.target.value })}
                      className="border-border/60"
                    />
                  </div>
                )}
              </div>

              {/* Scope Options */}
              <div className="border border-border/60 rounded-lg p-3 bg-muted/10">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="chk-apply-to-all"
                    checked={formData.apply_to_all}
                    onChange={(e) => setFormData({ ...formData, apply_to_all: e.target.checked })}
                    className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="chk-apply-to-all" className="text-sm font-semibold cursor-pointer">
                    Apply to all items in this store
                  </label>
                </div>

                {!formData.apply_to_all && (
                  <div className="mt-3 pt-2 border-t border-border/40 animate-in slide-in-from-top-1 duration-150">
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Select Targeted Item <span className="text-destructive">*</span>
                    </label>
                    <select
                      required
                      value={formData.item}
                      disabled={loadingItems || !formData.store}
                      onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                      className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="" disabled>
                        {loadingItems ? 'Loading store items...' : 'Choose an item'}
                      </option>
                      {items.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name} (${Number(i.price).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Dates & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Start Date <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                    className="border-border/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    End Date <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    className="border-border/60"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-promo-active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="chk-promo-active" className="text-sm font-semibold cursor-pointer">
                  Activate this promotion immediately
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-border mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="border-border/60 text-foreground"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/95 text-primary-foreground">
                  {editingPromoId ? 'Save Changes' : 'Create Promotion'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
