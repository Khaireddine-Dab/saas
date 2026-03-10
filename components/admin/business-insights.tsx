'use client';

import { TrendingUp, TrendingDown, Store } from 'lucide-react';
import { useBusinessInsights } from '@/hooks/useSystemHealth';
import { Card } from '@/components/ui/card';

export function BusinessInsights() {
  const insights = useBusinessInsights();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Store className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Business Growth Insights</h3>
      </div>

      <div className="space-y-6">
        {/* Top Performing */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Top Performing Businesses</h4>
          <div className="space-y-2">
            {insights.topBusinesses.map(business => (
              <div key={business.id} className="flex items-between justify-between p-3 rounded-lg border border-border hover:border-muted-foreground/30 transition-colors">
                <div className="flex-1">
                  <div className="font-medium text-sm text-foreground">{business.name}</div>
                  <div className="text-xs text-muted-foreground">Revenue: ${business.revenue.toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-green-500">+{business.growth}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fastest Growing */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Fastest Growing</h4>
          <div className="space-y-2">
            {insights.fastestGrowing.map(business => (
              <div key={business.id} className="flex items-between justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex-1">
                  <div className="font-medium text-sm text-foreground">{business.name}</div>
                  <div className="text-xs text-muted-foreground">Revenue: ${business.revenue.toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-green-500">+{business.growth}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Losing Traffic */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Needs Attention</h4>
          <div className="space-y-2">
            {insights.losingTraffic.map(business => (
              <div key={business.id} className="flex items-between justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex-1">
                  <div className="font-medium text-sm text-foreground">{business.name}</div>
                  <div className="text-xs text-muted-foreground">Revenue: ${business.revenue.toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-semibold text-destructive">{business.growth}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
