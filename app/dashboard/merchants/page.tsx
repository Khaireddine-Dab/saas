'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, Star, MapPin, Trash2, Ban, Package, Loader2, Check, X, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { storesApi } from '@/lib/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

type MappedMerchant = {
  id: string;
  storeName: string;
  ownerName: string;
  businessType: string;
  status: any;
  rating: string;
  reviewCount: number;
  totalOrders: number;
  totalEarnings: number;
  accountBalance: number;
  productCount: number;
  flaggedProducts: number;
  createdAt: string;
  joinedAt: string;
};

const statusColors = {
  active: 'bg-green-500/20 text-green-500 border-green-500/40',
  verified: 'bg-primary/20 text-primary border-primary/40',
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
  suspended: 'bg-red-500/20 text-red-500 border-red-500/40',
  banned: 'bg-red-500/30 text-red-500 border-red-500/50',
};

// Map backend PENDING/PUBLISHED/REJECTED to UI active/pending/suspended
const mapBackendStatus = (status: string) => {
  if (status === 'PUBLISHED') return 'active';
  if (status === 'PENDING') return 'pending';
  if (status === 'REJECTED') return 'suspended';
  return 'suspended';
};

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<MappedMerchant[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);

  const [showProductManager, setShowProductManager] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const data = await storesApi.getAll();

      // Fetch item counts for all stores in parallel
      const itemCounts = await Promise.allSettled(
        data.map((store: any) =>
          storesApi.getProducts(parseInt(store.id)).then((items: any[]) => items.length)
        )
      );

      const mapped = data.map((store: any, i: number) => ({
        id: store.id.toString(),
        storeName: store.name,
        ownerName: store.ownerDetails?.full_name || 'Inconnu',
        businessType: store.description || 'Non défini',
        status: mapBackendStatus(store.status),
        rating: store.rating_average ? parseFloat(store.rating_average).toFixed(1) : "0.0",
        reviewCount: store.total_reviews || 0,
        totalOrders: store.total_orders || 0,
        totalEarnings: 0,
        accountBalance: 0,
        productCount: itemCounts[i].status === 'fulfilled' ? itemCounts[i].value : 0,
        flaggedProducts: 0,
        createdAt: new Date(store.created_at).toLocaleDateString(),
        joinedAt: new Date(store.created_at).toLocaleDateString(),
      }));
      setMerchants(mapped);
    } catch (err: any) {
      toast.error('Erreur lors du chargement des marchands');
    } finally {
      setLoading(false);
    }
  };

  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = merchant.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || merchant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleManageProducts = async (merchantId: string) => {
    setSelectedMerchant(merchantId);
    setShowProductManager(true);
    setLoadingProducts(true);
    setProducts([]);

    try {
      const data = await storesApi.getProducts(parseInt(merchantId));
      setProducts(data);
    } catch (err: any) {
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleDeleteProduct = (merchantId: string, productId: string) => {
    console.log('[v0] Delete product:', productId, 'from merchant:', merchantId);
  };

  const handleBlockProduct = (merchantId: string, productId: string) => {
    console.log('[v0] Block product:', productId, 'from merchant:', merchantId);
  };

  const handleAcceptMerchant = async (id: string) => {
    console.log('[Merchants] Accepting merchant:', id);
    try {
      const result = await storesApi.validate(parseInt(id));
      console.log('[Merchants] Accept result:', result);
      toast.success('Merchant accepted successfully');
      fetchMerchants();
    } catch (err: any) {
      console.error('[Merchants] Error accepting merchant:', err);
      toast.error(err.message || 'Error accepting merchant');
    }
  };

  const handleRejectMerchant = async (id: string) => {
    console.log('[Merchants] Rejecting merchant:', id);
    try {
      const result = await storesApi.reject(parseInt(id));
      console.log('[Merchants] Reject result:', result);
      toast.success('Merchant rejected successfully');
      fetchMerchants();
    } catch (err: any) {
      console.error('[Merchants] Error rejecting merchant:', err);
      toast.error(err.message || 'Error rejecting merchant');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Merchant Management</h1>
          <p className="text-muted-foreground">Manage and monitor all marketplace merchants</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Merchant
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Merchants</div>
          <div className="text-2xl font-bold text-foreground">{merchants.length}</div>
          <div className="text-xs text-green-500 mt-1">+5 this month</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-bold text-green-500">
            {merchants.filter(m => m.status === 'active').length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Actively selling</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Commission</div>
          <div className="text-2xl font-bold text-foreground">$0</div>
          <div className="text-xs text-muted-foreground mt-1">This month</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg Rating</div>
          <div className="text-2xl font-bold text-amber-500">
            {merchants.length > 0
              ? (merchants.reduce((sum, m) => sum + parseFloat(m.rating), 0) / merchants.length).toFixed(1)
              : "0.0"
            }
          </div>
          <div className="text-xs text-muted-foreground mt-1">★ From {merchants.reduce((sum, m) => sum + m.reviewCount, 0)} reviews</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full max-w-sm relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search merchants..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || undefined)}
            className="px-3 py-2 rounded-lg border border-border text-sm bg-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Merchants Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Store</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Owner</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Type</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Rating</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Orders</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Items</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Created At</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Earnings</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMerchants.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-8 text-center text-muted-foreground">Aucun marchand trouvé.</td>
                  </tr>
                ) : (
                  filteredMerchants.map((merchant) => (
                    <tr key={merchant.id} className="border-b hover:bg-muted">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-foreground">{merchant.storeName}</p>
                          <p className="text-xs text-muted-foreground">{merchant.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-foreground">{merchant.ownerName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm capitalize">{merchant.businessType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={statusColors[merchant.status as keyof typeof statusColors]}>
                          {merchant.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                          <span className="font-semibold">{merchant.rating}</span>
                          <span className="text-muted-foreground">({merchant.reviewCount})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold">{merchant.totalOrders}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="font-semibold flex items-center gap-2">
                            <Package className="w-4 h-4 text-blue-600" />
                            {merchant.productCount}
                          </p>
                          {merchant.flaggedProducts > 0 && (
                            <p className="text-xs text-red-600 font-semibold">
                              {merchant.flaggedProducts} flagged
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">{merchant.createdAt}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold">${merchant.totalEarnings.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Balance: ${merchant.accountBalance.toLocaleString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleManageProducts(merchant.id)}
                            className="p-2 hover:bg-primary/10 rounded text-primary"
                            title="Manage Products"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button type="button" className="p-1 hover:bg-muted/80 rounded transition-colors">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              
                              {merchant.status === 'pending' && (
                                <>
                                  <DropdownMenuItem 
                                    onSelect={() => handleAcceptMerchant(merchant.id)}
                                    className="text-green-600 focus:text-green-600 focus:bg-green-50"
                                  >
                                    <Check className="w-4 h-4 mr-2" />
                                    Accept Merchant
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onSelect={() => handleRejectMerchant(merchant.id)}
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Reject Merchant
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}

                              <DropdownMenuItem onSelect={() => handleManageProducts(merchant.id)}>
                                <Package className="w-4 h-4 mr-2" />
                                Manage Products
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                <Ban className="w-4 h-4 mr-2" />
                                Suspend Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredMerchants.length} of {merchants.length} merchants
        </p>
        <div className="flex gap-2">
          <Button variant="outline" disabled>Previous</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>

      {/* Product Management Modal */}
      {showProductManager && selectedMerchant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Manage Items - {merchants.find(m => m.id === selectedMerchant)?.storeName || selectedMerchant}</h2>
                <button
                  onClick={() => {
                    setShowProductManager(false);
                    setSelectedMerchant(null);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

                {/* Items List */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Items List ({products.length})</h3>
                {loadingProducts ? (
                  <div className="py-10 flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : products.length === 0 ? (
                  <p className="text-muted-foreground text-sm italic py-4">Aucun item pour cette boutique. (0 items)</p>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="border border-border rounded-lg p-3 flex items-center justify-between bg-card text-sm">
                      <div>
                        <p className="font-semibold text-foreground">{product.name}</p>
                        <div className="flex gap-3 text-xs text-muted-foreground mt-1 items-center">
                          <span className="bg-muted px-2 py-1 rounded capitalize">{product.category || 'Non défini'}</span>
                          <span className="font-medium text-primary">{parseFloat(product.price).toFixed(2)} TND</span>
                          <Badge variant="outline" className="capitalize">{product.status}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteProduct(selectedMerchant, product.id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleBlockProduct(selectedMerchant, product.id)}
                          className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded"
                          title="Block Product"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowProductManager(false);
                    setSelectedMerchant(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
