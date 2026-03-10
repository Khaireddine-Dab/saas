'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, DollarSign } from 'lucide-react';

interface PricingRule {
  id: string;
  name: string;
  type: 'distance-based' | 'weight-based' | 'zone-based' | 'time-based';
  basePrice: number;
  perUnit: number;
  minPrice: number;
  maxPrice: number;
  zones: string[];
  status: 'active' | 'inactive';
  appliedToVehicles: string[];
  createdAt: Date;
}

const mockPricingRules: PricingRule[] = [
  {
    id: '1',
    name: 'Distance-Based Pricing',
    type: 'distance-based',
    basePrice: 5.0,
    perUnit: 0.5,
    minPrice: 3.0,
    maxPrice: 50.0,
    zones: ['All Zones'],
    status: 'active',
    appliedToVehicles: ['1', '2', '3'],
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'Zone-Based Pricing - Downtown',
    type: 'zone-based',
    basePrice: 4.0,
    perUnit: 0.0,
    minPrice: 4.0,
    maxPrice: 10.0,
    zones: ['Downtown'],
    status: 'active',
    appliedToVehicles: ['1', '2'],
    createdAt: new Date('2023-01-05'),
  },
  {
    id: '3',
    name: 'Weight-Based Pricing',
    type: 'weight-based',
    basePrice: 3.0,
    perUnit: 0.25,
    minPrice: 2.0,
    maxPrice: 30.0,
    zones: ['All Zones'],
    status: 'active',
    appliedToVehicles: ['3', '4'],
    createdAt: new Date('2023-02-01'),
  },
  {
    id: '4',
    name: 'Rush Hour Surcharge',
    type: 'time-based',
    basePrice: 2.0,
    perUnit: 0.0,
    minPrice: 2.0,
    maxPrice: 10.0,
    zones: ['All Zones'],
    status: 'inactive',
    appliedToVehicles: ['1', '2', '3'],
    createdAt: new Date('2023-02-10'),
  },
];

const typeIcons = {
  'distance-based': '📍',
  'weight-based': '⚖️',
  'zone-based': '🗺️',
  'time-based': '⏰',
};

const typeLabels = {
  'distance-based': 'Distance-Based',
  'weight-based': 'Weight-Based',
  'zone-based': 'Zone-Based',
  'time-based': 'Time-Based',
};

export default function PricingPage() {
  const [rules, setRules] = useState<PricingRule[]>(mockPricingRules);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRules = rules.filter((rule) =>
    rule.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalRules: rules.length,
    activeRules: rules.filter((r) => r.status === 'active').length,
    avgBasePrice: (rules.reduce((sum, r) => sum + r.basePrice, 0) / rules.length).toFixed(2),
    avgPerUnit: (rules.reduce((sum, r) => sum + r.perUnit, 0) / rules.length).toFixed(2),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Delivery Pricing Rules</h1>
          <p className="text-muted-foreground">Configure pricing models and surcharges</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Pricing Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Rules</div>
          <div className="text-2xl font-bold text-foreground">{stats.totalRules}</div>
          <div className="text-xs text-muted-foreground mt-1">{stats.activeRules} active</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg Base Price</div>
          <div className="text-2xl font-bold text-foreground">${stats.avgBasePrice}</div>
          <div className="text-xs text-muted-foreground mt-1">Starting price</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg Per Unit</div>
          <div className="text-2xl font-bold text-foreground">${stats.avgPerUnit}</div>
          <div className="text-xs text-muted-foreground mt-1">Additional charge</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Pricing Types</div>
          <div className="text-2xl font-bold text-foreground">{Object.keys(typeLabels).length}</div>
          <div className="text-xs text-muted-foreground mt-1">Available models</div>
        </Card>
      </div>

      {/* Search */}
      <Input
        placeholder="Search pricing rules..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Pricing Rules */}
      <div className="space-y-3">
        {filteredRules.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No pricing rules found</p>
          </Card>
        ) : (
          filteredRules.map((rule) => (
            <Card
              key={rule.id}
              className={`p-4 ${rule.status === 'inactive' ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{typeIcons[rule.type]}</span>
                    <div>
                      <h3 className="font-semibold text-foreground">{rule.name}</h3>
                      <p className="text-sm text-muted-foreground">{typeLabels[rule.type]}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-muted rounded mb-3 border border-border">
                    <div>
                      <div className="text-xs text-muted-foreground">Base Price</div>
                      <div className="font-semibold text-foreground">${rule.basePrice}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Per Unit</div>
                      <div className="font-semibold text-foreground">${rule.perUnit}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Min Price</div>
                      <div className="font-semibold text-foreground">${rule.minPrice}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Max Price</div>
                      <div className="font-semibold text-foreground">${rule.maxPrice}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Zones:</span>
                      {rule.zones.map((zone) => (
                        <Badge key={zone} variant="secondary" className="text-xs">
                          {zone}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  <Badge
                    className={
                      rule.status === 'active'
                        ? 'bg-green-500/20 text-green-500 border-green-500/40'
                        : 'bg-muted text-muted-foreground border-border'
                    }
                  >
                    {rule.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pricing Rules Info */}
      <Card className="p-6 bg-primary/10 border border-primary/20">
        <h3 className="font-semibold text-primary mb-3">Pricing Rule Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="text-foreground">
            <strong className="text-primary">Distance-Based:</strong> Price varies by delivery distance
          </div>
          <div className="text-foreground">
            <strong className="text-primary">Weight-Based:</strong> Price varies by package weight
          </div>
          <div className="text-foreground">
            <strong className="text-primary">Zone-Based:</strong> Fixed price per delivery zone
          </div>
          <div className="text-foreground">
            <strong className="text-primary">Time-Based:</strong> Additional charges for peak hours/rush delivery
          </div>
        </div>
      </Card>
    </div>
  );
}
