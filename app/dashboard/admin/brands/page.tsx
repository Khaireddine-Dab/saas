'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, Search, ExternalLink } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  country?: string;
  productsCount: number;
  status: 'active' | 'inactive';
  featured: boolean;
  createdAt: Date;
}

const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'Apple',
    logo: '🍎',
    website: 'apple.com',
    country: 'USA',
    productsCount: 456,
    status: 'active',
    featured: true,
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'Samsung',
    logo: '📱',
    website: 'samsung.com',
    country: 'South Korea',
    productsCount: 389,
    status: 'active',
    featured: true,
    createdAt: new Date('2023-01-05'),
  },
  {
    id: '3',
    name: 'Sony',
    logo: '🎮',
    website: 'sony.com',
    country: 'Japan',
    productsCount: 234,
    status: 'active',
    featured: true,
    createdAt: new Date('2023-01-10'),
  },
  {
    id: '4',
    name: 'Nike',
    logo: '👟',
    website: 'nike.com',
    country: 'USA',
    productsCount: 567,
    status: 'active',
    featured: false,
    createdAt: new Date('2023-02-01'),
  },
  {
    id: '5',
    name: 'Adidas',
    logo: '👕',
    website: 'adidas.com',
    country: 'Germany',
    productsCount: 445,
    status: 'active',
    featured: false,
    createdAt: new Date('2023-02-05'),
  },
];

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFeatured, setFilterFeatured] = useState(false);

  const filteredBrands = brands.filter((brand) => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFeatured = !filterFeatured || brand.featured;
    return matchesSearch && matchesFeatured;
  });

  const stats = {
    total: brands.length,
    active: brands.filter((b) => b.status === 'active').length,
    featured: brands.filter((b) => b.featured).length,
    totalProducts: brands.reduce((sum, b) => sum + b.productsCount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Brand Management</h1>
          <p className="text-muted-foreground">Manage product brands and manufacturers</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Brand
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Brands</div>
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          <div className="text-xs text-muted-foreground mt-1">{stats.active} active</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Featured Brands</div>
          <div className="text-2xl font-bold text-primary">{stats.featured}</div>
          <div className="text-xs text-muted-foreground mt-1">On homepage</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Products</div>
          <div className="text-2xl font-bold text-foreground">{(stats.totalProducts / 1000).toFixed(1)}K</div>
          <div className="text-xs text-muted-foreground mt-1">Across all brands</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg Products</div>
          <div className="text-2xl font-bold text-foreground">
            {(stats.totalProducts / stats.total).toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Per brand</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button
          variant={filterFeatured ? 'default' : 'outline'}
          onClick={() => setFilterFeatured(!filterFeatured)}
        >
          Featured Only
        </Button>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrands.length === 0 ? (
          <Card className="col-span-full p-8 text-center">
            <p className="text-muted-foreground">No brands found</p>
          </Card>
        ) : (
          filteredBrands.map((brand) => (
            <Card
              key={brand.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="space-y-4">
                {/* Brand Header */}
                <div className="flex items-start justify-between">
                  {brand.logo && <span className="text-4xl">{brand.logo}</span>}
                  <div className="flex gap-1">
                    {brand.featured && (
                      <Badge className="bg-yellow-500/20 text-yellow-400">Featured</Badge>
                    )}
                    <Badge
                      className={
                        brand.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {brand.status}
                    </Badge>
                  </div>
                </div>

                {/* Brand Info */}
                <div>
                  <h3 className="font-semibold text-foreground">{brand.name}</h3>
                  {brand.country && (
                    <p className="text-xs text-muted-foreground">{brand.country}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 py-2 border-t border-b">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {brand.productsCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">
                      {brand.createdAt.getFullYear()}
                    </div>
                    <div className="text-xs text-muted-foreground">Added</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {brand.website && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Visit
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
