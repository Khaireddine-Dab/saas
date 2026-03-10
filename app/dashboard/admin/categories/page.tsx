'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parent?: string;
  productsCount: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  order: number;
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets',
    icon: '📱',
    productsCount: 2450,
    status: 'active',
    createdAt: new Date('2023-01-01'),
    order: 1,
  },
  {
    id: '2',
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Mobile phones and accessories',
    parent: '1',
    icon: '📞',
    productsCount: 890,
    status: 'active',
    createdAt: new Date('2023-01-05'),
    order: 1,
  },
  {
    id: '3',
    name: 'Laptops',
    slug: 'laptops',
    description: 'Laptop computers and tablets',
    parent: '1',
    icon: '💻',
    productsCount: 560,
    status: 'active',
    createdAt: new Date('2023-01-10'),
    order: 2,
  },
  {
    id: '4',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, shoes, and accessories',
    icon: '👕',
    productsCount: 3200,
    status: 'active',
    createdAt: new Date('2023-01-15'),
    order: 2,
  },
  {
    id: '5',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Furniture and home items',
    icon: '🏠',
    productsCount: 1800,
    status: 'active',
    createdAt: new Date('2023-02-01'),
    order: 3,
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const parentCategories = categories.filter((c) => !c.parent);
  const stats = {
    total: categories.length,
    active: categories.filter((c) => c.status === 'active').length,
    totalProducts: categories.reduce((sum, c) => sum + c.productsCount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Category Management</h1>
          <p className="text-muted-foreground">Organize and manage product categories</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Categories</div>
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          <div className="text-xs text-muted-foreground mt-1">{stats.active} active</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Parent Categories</div>
          <div className="text-2xl font-bold text-foreground">{parentCategories.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Top-level</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Products</div>
          <div className="text-2xl font-bold text-foreground">{(stats.totalProducts / 1000).toFixed(1)}K</div>
          <div className="text-xs text-muted-foreground mt-1">Across all categories</div>
        </Card>
      </div>

      {/* Search */}
      <div>
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Categories Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Slug</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Products</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No categories found
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {category.icon && <span className="text-xl">{category.icon}</span>}
                        <div>
                          <div className="font-medium text-foreground">{category.name}</div>
                          {category.description && (
                            <div className="text-sm text-muted-foreground">{category.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{category.slug}</td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{category.productsCount}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={
                          category.status === 'active'
                            ? 'bg-green-500/20 text-green-500 border-green-500/40'
                            : 'bg-muted text-muted-foreground border-border'
                        }
                      >
                        {category.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(category.id)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Category Tree View */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Category Hierarchy</h2>
        <div className="space-y-3">
          {parentCategories.map((parent) => (
            <div key={parent.id}>
              <div className="p-3 bg-muted rounded-lg font-medium text-foreground border border-border">
                {parent.icon} {parent.name}
              </div>
              <div className="ml-6 mt-2 space-y-2">
                {categories
                  .filter((c) => c.parent === parent.id)
                  .map((child) => (
                    <div
                      key={child.id}
                      className="p-2 bg-card border border-border rounded text-sm text-foreground"
                    >
                      {child.icon} {child.name}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
