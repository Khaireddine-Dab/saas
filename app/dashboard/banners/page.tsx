'use client';

import { useEffect, useState } from 'react';
import { Download, Filter, Plus, Search, Image as ImageIcon, Eye, X } from 'lucide-react';
import { useBanners } from '@/hooks/useBanners';
import { useBannerMutations } from '@/hooks/useBannerMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BannerStatus, BannerPlacement } from '@/types/banner';
import type { CreateBannerInput } from '@/hooks/useBannerMutations';

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
  const [isClient, setIsClient] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [storeId, setStoreId] = useState<number>(1); // Default store ID
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const { banners, statistics } = useBanners({ status: statusFilter, placement: placementFilter, search: searchQuery });
  const { createBanner, isLoading: isCreating, error: createError, clearError } = useBannerMutations();

  const [formData, setFormData] = useState<CreateBannerInput>({
    title: '',
    description: '',
    image_url: '',
    target_url: '',
    placement: 'homepage',
    status: 'draft',
    priority: 1,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    conversion_rate: 0.01,
    created_by: 'admin',
    store_id: storeId,
  });

  // Prevent hydration error by only rendering dynamic content on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const displayStats = isClient ? statistics : {
    totalBanners: 0,
    activeBanners: 0,
    totalImpressions: 0,
    totalClicks: 0,
    avgClickRate: 0,
  };

  const handleCreateBanner = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a banner title');
      return;
    }
    if (!formData.start_date || !formData.end_date) {
      alert('Please select valid dates');
      return;
    }
    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      alert('Start date must be before end date');
      return;
    }

    const result = await createBanner({
      ...formData,
      store_id: storeId,
    });

    if (result) {
      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        image_url: '',
        target_url: '',
        placement: 'homepage',
        status: 'draft',
        priority: 1,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        conversion_rate: 0.01,
        created_by: 'admin',
        store_id: storeId,
      });
      setFilePreview(null);
      setUploadedFileName('');
      setShowCreateModal(false);
      // Optionally refresh banners here if you implement a refetch mechanism
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (images and videos)
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image (JPG, PNG, GIF, WebP) or video (MP4, WebM)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadedFileName(file.name);

    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setFilePreview(result);
      // Use the preview as the image_url (base64 encoded)
      setFormData({ ...formData, image_url: result });
    };
    reader.readAsDataURL(file);
  };

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
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Banner
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Banners</div>
          <div className="text-2xl font-bold text-foreground">{displayStats.totalBanners}</div>
          <div className="text-xs text-muted-foreground mt-1">All banners</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-bold text-green-500">{displayStats.activeBanners}</div>
          <div className="text-xs text-muted-foreground mt-1">Currently live</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Impressions</div>
          <div className="text-2xl font-bold text-foreground">{(displayStats.totalImpressions / 1000).toFixed(0)}K</div>
          <div className="text-xs text-muted-foreground mt-1">Views</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg Click Rate</div>
          <div className="text-2xl font-bold text-foreground">{(displayStats.avgClickRate * 100).toFixed(2)}%</div>
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

      {/* Create Banner Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-xl font-bold text-foreground">Create New Banner</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    clearError();
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Error Message */}
              {createError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {createError}
                </div>
              )}

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Title *</label>
                  <Input
                    placeholder="e.g., Summer Sale"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                {/* Placement */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-foreground">Placement *</label>
                  <select
                    value={formData.placement}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        placement: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="homepage">Home Page</option>
                    <option value="category">Category</option>
                    <option value="checkout">Checkout</option>
                    <option value="popup">Popup</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-foreground">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Priority</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Start Date *</label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-semibold mb-1">End Date *</label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea
                    placeholder="Banner description..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                    rows={3}
                  />
                </div>

                {/* Image/Video Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Banner Media (Image or Video)</label>
                  
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer mb-3"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = e.dataTransfer.files;
                      if (files.length > 0) {
                        const event = {
                          target: { files }
                        } as any;
                        handleFileChange(event);
                      }
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="banner-file-input"
                    />
                    <label htmlFor="banner-file-input" className="cursor-pointer block">
                      <div className="text-muted-foreground mb-2">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <div className="text-sm mb-1">
                          <span className="font-medium text-foreground">Click to upload</span> or drag and drop
                        </div>
                        <div className="text-xs text-muted-foreground">
                          PNG, JPG, GIF, WebP, MP4 or WebM (Max 10MB)
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* File Preview */}
                  {filePreview && (
                    <div className="mb-3 rounded-lg overflow-hidden bg-muted p-2">
                      <div className="text-xs text-muted-foreground mb-2">
                        Selected: <span className="text-foreground font-medium">{uploadedFileName}</span>
                      </div>
                      {uploadedFileName.includes('.mp4') || uploadedFileName.includes('.webm') ? (
                        <video 
                          src={filePreview} 
                          className="w-full h-48 object-cover rounded" 
                          controls 
                        />
                      ) : (
                        <img 
                          src={filePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setFilePreview(null);
                          setUploadedFileName('');
                          setFormData({ ...formData, image_url: '' });
                        }}
                        className="mt-2 text-xs text-red-500 hover:text-red-600"
                      >
                        Remove file
                      </button>
                    </div>
                  )}

                  {/* Alternative URL Input */}
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Or paste image/video URL:</div>
                    <Input
                      placeholder="https://example.com/banner.jpg"
                      value={filePreview ? '' : formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      disabled={!!filePreview}
                    />
                  </div>
                </div>

                {/* Target URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Target URL</label>
                  <Input
                    placeholder="/promotions/summer-sale"
                    value={formData.target_url}
                    onChange={(e) =>
                      setFormData({ ...formData, target_url: e.target.value })
                    }
                  />
                </div>

                {/* Conversion Rate */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Conversion Rate</label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={formData.conversion_rate || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        conversion_rate: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 border-t border-border pt-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    clearError();
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateBanner}
                  disabled={isCreating}
                  className="flex-1"
                >
                  {isCreating ? 'Creating...' : 'Create Banner'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
