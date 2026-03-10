'use client';

import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';
import { useRevenueIntelligence } from '@/hooks/useSystemHealth';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function RevenueIntelligence() {
  const revenue = useRevenueIntelligence();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-green-500" />
        <h3 className="font-semibold text-foreground">Revenue Intelligence</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>Total Revenue</span>
          </div>
          <div className="text-2xl font-bold text-foreground">${(revenue.totalRevenue / 1000).toFixed(0)}K</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="w-4 h-4" />
            <span>Avg Order Value</span>
          </div>
          <div className="text-2xl font-bold text-foreground">${revenue.avgOrderValue}</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>High-Value Customers</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{revenue.highValueCustomers.length}</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>30-Day Forecast</span>
          </div>
          <div className="text-2xl font-bold text-green-500">${(revenue.forecast30Day / 1000).toFixed(0)}K</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Top Categories</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenue.topCategories}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
              <XAxis dataKey="category" tick={{ fontSize: 12, fill: 'currentColor' }} />
              <YAxis tick={{ fontSize: 12, fill: 'currentColor' }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Bar dataKey="revenue" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Top Customers</h4>
          <div className="space-y-2">
            {revenue.highValueCustomers.map(customer => (
              <div key={customer.id} className="flex items-between justify-between p-2 rounded bg-muted hover:bg-accent transition-colors">
                <div className="flex-1">
                  <div className="font-medium text-sm text-foreground">{customer.name}</div>
                  <div className="text-xs text-muted-foreground">{customer.orderCount} orders</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm text-foreground">${customer.totalSpend.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">${customer.avgOrderValue}/order</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
