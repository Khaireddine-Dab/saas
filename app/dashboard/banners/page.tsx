'use client';

import { useState } from 'react';
import { Download, Filter, Plus, Search, Image as ImageIcon, Eye } from 'lucide-react';
import { useBanners } from '@/hooks/useBanners';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BannerStatus, BannerPlacement } from '@/types/banner';

const statusColors: Record<BannerStatus, string> = {
  draft: 'bg-muted text-muted-foreground border-border',
  scheduled: 'bg-primary/20 text-primary border-primary/40',
  active: 'bg-green-500/20 text-green-500 border-green-500/40',
  inactive: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
  expired: 'bg-red-500/20 text-red-500 border-red-500/40',
};

const placementLabels: Record<BannerPlacement, string> = {
  homepage: 'Home Page',
  category: 'Category',
  checkout: 'Checkout',
  popup: 'Popup',
};

export default function BannersPage() {
  const [statusFilter, setStatusFilter] = useState<BannerStatus | undefined>();
  const [placementFilter, setPlacementFilter] = useState<BannerPlacement | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const { banners, statistics } = useBanners({ status: statusFilter, placement: placementFilter, search: searchQuery });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Banner Management</h1>
          <p className="text-muted-foreground">Create and schedule promotional banners</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Banner
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Banners</div>
          <div className="text-2xl font-bold text-foreground">{statistics.totalBanners}</div>
          <div className="text-xs text-muted-foreground mt-1">All banners</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-bold text-green-500">{statistics.activeBanners}</div>
          <div className="text-xs text-muted-foreground mt-1">Currently live</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Impressions</div>
          <div className="text-2xl font-bold text-foreground">{(statistics.totalImpressions / 1000).toFixed(0)}K</div>
          <div className="text-xs text-muted-foreground mt-1">Views</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg Click Rate</div>
          <div className="text-2xl font-bold text-foreground">{(statistics.avgClickRate * 100).toFixed(2)}%</div>
          <div className="text-xs text-muted-foreground mt-1">CTR</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by banner title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter || ''}
              onChange={e => setStatusFilter(e.target.value as BannerStatus || undefined)}
              className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground hover:bg-muted transition-colors"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
            <select
              value={placementFilter || ''}
              onChange={e => setPlacementFilter(e.target.value as BannerPlacement || undefined)}
              className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground hover:bg-muted transition-colors"
            >
              <option value="">All Placements</option>
              <option value="homepage">Home Page</option>
              <option value="category">Category</option>
              <option value="checkout">Checkout</option>
              <option value="popup">Popup</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {banners.length > 0 ? (
          banners.slice(0, 8).map(banner => (
            <Card key={banner.id} className="overflow-hidden hover:shadow-md transition">
              <div className="aspect-video bg-muted overflow-hidden relative">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{banner.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{banner.description}</p>
                  </div>
                  <Badge className={statusColors[banner.status]}>
                    {banner.status.charAt(0).toUpperCase() + banner.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-border my-3">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground font-medium">Impressions</div>
                    <div className="font-bold text-foreground">{(banner.impressions / 1000).toFixed(1)}K</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground font-medium">Clicks</div>
                    <div className="font-bold text-foreground">{banner.clicks}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground font-medium">CTR</div>
                    <div className="font-bold text-foreground">{((banner.clicks / banner.impressions) * 100).toFixed(2)}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Placement:</strong> {placementLabels[banner.placement]}
                  </span>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Priority:</strong> {banner.priority}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No banners found
          </div>
        )}
      </div>
    </div>
  );
}
