'use client';

import React, { useState } from 'react';
import { ChartCard } from '@/components/dashboard/chart-card';
import { DataTable } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { mockTopSearchTerms, mockCategoryDemand } from '@/lib/mock-data';
import { TopSearchTerm, CategoryDemand } from '@/types/analytics';

export default function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState('30d');

  const searchPerformanceData = [
    { week: 'Week 1', searches: 12400, conversions: 2400, revenue: 24000 },
    { week: 'Week 2', searches: 15210, conversions: 1398, revenue: 21210 },
    { week: 'Week 3', searches: 18290, conversions: 9800, revenue: 29290 },
    { week: 'Week 4', searches: 21800, conversions: 3908, revenue: 32800 },
  ];

  const conversionFunnelData = [
    { name: 'Searches', value: 125000 },
    { name: 'Results', value: 98400 },
    { name: 'Clicks', value: 65200 },
    { name: 'Orders', value: 9800 },
  ];

  const COLORS = ['#000000', '#374151', '#6b7280', '#9ca3af'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-2">Platform performance and search insights</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Time Period Selector */}
      <div className="flex gap-2">
        {[
          { label: 'Last 7 days', value: '7d' },
          { label: 'Last 30 days', value: '30d' },
          { label: 'Last 90 days', value: '90d' },
          { label: 'Last year', value: '1y' },
        ].map((period) => (
          <Button
            key={period.value}
            variant={timePeriod === period.value ? 'default' : 'outline'}
            onClick={() => setTimePeriod(period.value)}
          >
            {period.label}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Searches</p>
          <p className="text-2xl font-bold text-foreground">123,400</p>
          <p className="text-xs text-green-600 mt-2">↑ 12% from last period</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Conversion Rate</p>
          <p className="text-2xl font-bold text-foreground">7.8%</p>
          <p className="text-xs text-green-600 mt-2">↑ 0.5% from last period</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Avg Click Value</p>
          <p className="text-2xl font-bold text-foreground">45 AED</p>
          <p className="text-xs text-red-600 mt-2">↓ 3% from last period</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Platform Revenue</p>
          <p className="text-2xl font-bold text-foreground">124 K AED</p>
          <p className="text-xs text-green-600 mt-2">↑ 15% from last period</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Performance */}
        <ChartCard title="Search Performance" description="Weekly search, clicks, and revenue">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={searchPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="searches" stroke="#000000" strokeWidth={2} />
              <Line type="monotone" dataKey="conversions" stroke="#374151" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Category Breakdown */}
        <ChartCard title="Category Demand" description="Search volume by category">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockCategoryDemand}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="searchCount" fill="#000000" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Conversion Funnel */}
        <ChartCard title="Conversion Funnel" description="User journey from search to order">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conversionFunnelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="#000000" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Conversion Rates Pie */}
        <ChartCard title="Funnel Conversion Rates" description="Percentage through each stage">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={conversionFunnelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#000000"
                dataKey="value"
              >
                {conversionFunnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Search Terms Table */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Top Search Terms</h3>
        <DataTable<TopSearchTerm>
          columns={[
            {
              key: 'term',
              label: 'Search Term',
              sortable: true,
            },
            {
              key: 'searchCount',
              label: 'Searches',
              sortable: true,
              render: (value) => value.toLocaleString(),
            },
            {
              key: 'resultCount',
              label: 'Results',
              sortable: true,
              render: (value) => value.toLocaleString(),
            },
            {
              key: 'conversionCount',
              label: 'Conversions',
              sortable: true,
              render: (value) => value.toLocaleString(),
            },
            {
              key: 'conversionRate',
              label: 'Conv. Rate',
              sortable: true,
              render: (value) => `${value.toFixed(1)}%`,
            },
          ]}
          data={mockTopSearchTerms}
        />
      </div>

      {/* Category Demand Table */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Category Demand Analysis</h3>
        <DataTable<CategoryDemand>
          columns={[
            {
              key: 'category',
              label: 'Category',
              sortable: true,
            },
            {
              key: 'searchCount',
              label: 'Searches',
              sortable: true,
              render: (value) => value.toLocaleString(),
            },
            {
              key: 'productCount',
              label: 'Products',
              sortable: true,
              render: (value) => value.toLocaleString(),
            },
            {
              key: 'businessCount',
              label: 'Businesses',
              sortable: true,
              render: (value) => value.toLocaleString(),
            },
            {
              key: 'demandTrend',
              label: 'Trend',
              sortable: true,
              render: (value) => (
                <span className={value === 'up' ? 'text-green-600' : value === 'down' ? 'text-red-600' : 'text-gray-600'}>
                  {value === 'up' ? '↑' : value === 'down' ? '↓' : '→'} {value}
                </span>
              ),
            },
            {
              key: 'percentageChange',
              label: 'Change',
              sortable: true,
              render: (value) => (
                <span className={value > 0 ? 'text-green-600' : 'text-red-600'}>
                  {value > 0 ? '+' : ''}{value.toFixed(1)}%
                </span>
              ),
            },
          ]}
          data={mockCategoryDemand}
        />
      </div>
    </div>
  );
}
