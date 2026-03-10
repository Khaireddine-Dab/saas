'use client';

import { useState } from 'react';
import { Search, Download, Plus, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockCampaigns = Array.from({ length: 12 }, (_, i) => ({
  id: `camp-${String(i + 1).padStart(4, '0')}`,
  name: `Campaign ${i + 1}`,
  type: ['flash_sale', 'seasonal', 'clearance', 'loyalty'][i % 4] as any,
  status: ['active', 'scheduled', 'ended', 'paused'][i % 4] as any,
  discount: Math.floor(Math.random() * 50) + 10,
  budget: Math.floor(Math.random() * 100000) + 10000,
  spent: Math.floor(Math.random() * 50000),
  redeemed: Math.floor(Math.random() * 1000) + 100,
  roi: (Math.random() * 300 + 50).toFixed(1),
  startDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
}));

const statusColors = {
  active: 'bg-green-500/20 text-green-400',
  scheduled: 'bg-primary/20 text-primary',
  ended: 'bg-muted text-muted-foreground',
  paused: 'bg-yellow-500/20 text-yellow-400',
};

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const filteredCampaigns = mockCampaigns.filter(camp => {
    const matchesSearch = camp.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || camp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCampaigns = filteredCampaigns.filter(c => c.status === 'active').length;
  const totalBudget = filteredCampaigns.filter(c => c.status === 'active').reduce((sum, c) => sum + c.budget, 0);
  const totalRedeemed = filteredCampaigns.reduce((sum, c) => sum + c.redeemed, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Promotional Campaigns</h1>
          <p className="text-muted-foreground">Manage and track promotional offers</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Active Campaigns</div>
          <div className="text-2xl font-bold text-green-400">{activeCampaigns}</div>
          <div className="text-xs text-muted-foreground mt-1">Running now</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Budget</div>
          <div className="text-2xl font-bold text-foreground">${(totalBudget / 1000).toFixed(0)}K</div>
          <div className="text-xs text-muted-foreground mt-1">Active campaigns</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Redeemed</div>
          <div className="text-2xl font-bold text-foreground">{totalRedeemed.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">Coupons used</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg ROI</div>
          <div className="text-2xl font-bold text-green-400">
            {(filteredCampaigns.reduce((sum, c) => sum + parseFloat(c.roi), 0) / Math.max(filteredCampaigns.length, 1)).toFixed(0)}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">Return on investment</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || undefined)}
            className="px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="ended">Ended</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </Card>

      {/* Campaigns Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Campaign Name</th>
                <th className="px-6 py-3 text-left font-semibold">Type</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-right font-semibold">Discount</th>
                <th className="px-6 py-3 text-right font-semibold">Budget</th>
                <th className="px-6 py-3 text-right font-semibold">Spent</th>
                <th className="px-6 py-3 text-right font-semibold">Redeemed</th>
                <th className="px-6 py-3 text-right font-semibold">ROI</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b hover:bg-muted/50">
                  <td className="px-6 py-4 font-semibold">{campaign.name}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm capitalize">{campaign.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={statusColors[campaign.status as keyof typeof statusColors]}>
                      {campaign.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold">{campaign.discount}%</td>
                  <td className="px-6 py-4 text-right">${campaign.budget.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">${campaign.spent.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-semibold">{campaign.redeemed}</td>
                  <td className="px-6 py-4 text-right text-green-400 font-semibold">{campaign.roi}%</td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="outline">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
