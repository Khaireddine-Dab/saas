'use client';

import { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Star, MapPin, Trash2, Ban, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockMerchants = Array.from({ length: 15 }, (_, i) => ({
  id: `merchant-${i + 1}`,
  storeName: `Store ${i + 1}`,
  ownerName: `Owner ${i + 1}`,
  businessType: ['restaurant', 'grocery', 'pharmacy'][i % 3],
  status: ['active', 'verified', 'pending'][i % 3] as any,
  rating: (3.5 + (i % 2) * 1.5).toFixed(1),
  reviewCount: Math.floor(Math.random() * 500) + 10,
  totalOrders: Math.floor(Math.random() * 1000) + 100,
  totalEarnings: Math.floor(Math.random() * 50000) + 5000,
  accountBalance: Math.floor(Math.random() * 10000),
  productCount: Math.floor(Math.random() * 250) + 20,
  flaggedProducts: Math.floor(Math.random() * 5),
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
}));

const statusColors = {
  active: 'bg-green-500/20 text-green-500 border-green-500/40',
  verified: 'bg-primary/20 text-primary border-primary/40',
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
  suspended: 'bg-red-500/20 text-red-500 border-red-500/40',
  banned: 'bg-red-500/30 text-red-500 border-red-500/50',
};

export default function MerchantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);
  const [showProductManager, setShowProductManager] = useState(false);

  const filteredMerchants = mockMerchants.filter(merchant => {
    const matchesSearch = merchant.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || merchant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleManageProducts = (merchantId: string) => {
    setSelectedMerchant(merchantId);
    setShowProductManager(true);
  };

  const handleDeleteProduct = (merchantId: string, productId: string) => {
    console.log('[v0] Delete product:', productId, 'from merchant:', merchantId);
  };

  const handleBlockProduct = (merchantId: string, productId: string) => {
    console.log('[v0] Block product:', productId, 'from merchant:', merchantId);
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
          <div className="text-2xl font-bold text-foreground">{mockMerchants.length}</div>
          <div className="text-xs text-green-500 mt-1">+5 this month</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-bold text-green-500">
            {mockMerchants.filter(m => m.status === 'active').length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Actively selling</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Commission</div>
          <div className="text-2xl font-bold text-foreground">$125,400</div>
          <div className="text-xs text-muted-foreground mt-1">This month</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg Rating</div>
          <div className="text-2xl font-bold text-amber-500">4.3</div>
          <div className="text-xs text-muted-foreground mt-1">★ From {mockMerchants.reduce((sum, m) => sum + m.reviewCount, 0)} reviews</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search merchants..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter || ''}
            onChange={e => setStatusFilter(e.target.value || undefined)}
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
      </Card>

      {/* Merchants Table */}
      <Card className="overflow-hidden">
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
                <th className="px-6 py-3 text-left font-semibold text-foreground">Products</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Created At</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Earnings</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMerchants.map((merchant) => (
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
                      <button className="p-1 hover:bg-muted/80 rounded">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredMerchants.length} of {mockMerchants.length} merchants
        </p>
        <div className="flex gap-2">
          <Button variant="outline" disabled>Previous</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>

      {/* Product Management Modal */}
      {showProductManager && selectedMerchant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Manage Products - {selectedMerchant}</h2>
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

              {/* Flagged Products List */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Flagged Products (3)</h3>
                {[
                  { id: 'prod-1', name: 'Product 1 - Counterfeit Alert', category: 'Electronics', reason: 'Suspected Counterfeit' },
                  { id: 'prod-2', name: 'Product 2 - Policy Violation', category: 'Clothing', reason: 'Policy Violation' },
                  { id: 'prod-3', name: 'Product 3 - Quality Issue', category: 'Home & Garden', reason: 'Quality Control Issue' },
                ].map((product) => (
                  <div key={product.id} className="border border-destructive/20 rounded-lg p-3 flex items-center justify-between bg-destructive/10">
                    <div>
                      <p className="font-semibold text-foreground">{product.name}</p>
                      <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                        <span className="bg-destructive/20 text-destructive px-2 py-1 rounded">{product.category}</span>
                        <span className="bg-orange-500/20 text-orange-500 px-2 py-1 rounded">{product.reason}</span>
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
                ))}
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
