'use client';

import { useState } from 'react';
import { Download, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const salesData = [
  { date: 'Mon', revenue: 24000, orders: 120, avgValue: 200 },
  { date: 'Tue', revenue: 31000, orders: 155, avgValue: 200 },
  { date: 'Wed', revenue: 28000, orders: 140, avgValue: 200 },
  { date: 'Thu', revenue: 35000, orders: 175, avgValue: 200 },
  { date: 'Fri', revenue: 42000, orders: 210, avgValue: 200 },
  { date: 'Sat', revenue: 48000, orders: 240, avgValue: 200 },
  { date: 'Sun', revenue: 38000, orders: 190, avgValue: 200 },
];

const categoryData = [
  { name: 'Food & Beverage', value: 45, revenue: 150000 },
  { name: 'Electronics', value: 25, revenue: 85000 },
  { name: 'Fashion', value: 18, revenue: 62000 },
  { name: 'Home & Garden', value: 12, revenue: 38000 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--primary) / 0.8)', 'hsl(var(--primary) / 0.6)', 'hsl(var(--primary) / 0.4)'];

export default function SalesReportPage() {
  const [dateRange, setDateRange] = useState('week');
  const [exportFormat, setExportFormat] = useState('pdf');

  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const conversionRate = (totalOrders / (totalOrders * 1.5)) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sales Report</h1>
          <p className="text-muted-foreground">Revenue analytics and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border text-sm bg-muted text-foreground"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Revenue</div>
          <div className="text-2xl font-bold text-foreground">${(totalRevenue / 1000).toFixed(1)}K</div>
          <div className="text-xs text-green-500 mt-1">+12.5% vs last period</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Orders</div>
          <div className="text-2xl font-bold text-foreground">{totalOrders.toLocaleString()}</div>
          <div className="text-xs text-green-500 mt-1">+8.2% vs last period</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg Order Value</div>
          <div className="text-2xl font-bold text-foreground">${avgOrderValue.toFixed(0)}</div>
          <div className="text-xs text-muted-foreground mt-1">Per transaction</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Conversion Rate</div>
          <div className="text-2xl font-bold text-foreground">{conversionRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground mt-1">Cart to order</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
                formatter={(value: any) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" name="Revenue" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Orders vs Revenue */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Orders vs Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" fill="hsl(var(--primary))" name="Orders" />
              <Line yAxisId="right" type="monotone" dataKey="avgValue" stroke="hsl(var(--primary) / 0.6)" name="Avg Value" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="hsl(var(--primary))"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Details */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Category Performance</h3>
          <div className="space-y-3">
            {categoryData.map((category) => (
              <div key={category.name} className="flex items-center justify-between p-3 bg-muted rounded border border-border">
                <div>
                  <p className="font-medium text-sm">{category.name}</p>
                  <p className="text-xs text-muted-foreground">{category.value}% of sales</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${category.revenue.toLocaleString()}</p>
                  <p className="text-xs text-green-500">+5.2%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Daily Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="text-left py-2 px-4 text-foreground">Date</th>
                <th className="text-right py-2 px-4 text-foreground">Revenue</th>
                <th className="text-right py-2 px-4 text-foreground">Orders</th>
                <th className="text-right py-2 px-4 text-foreground">Avg Order Value</th>
                <th className="text-right py-2 px-4 text-foreground">Growth</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((row, idx) => (
                <tr key={row.date} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{row.date}</td>
                  <td className="py-3 px-4 text-right font-semibold">${row.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">{row.orders}</td>
                  <td className="py-3 px-4 text-right">${row.avgValue}</td>
                  <td className="py-3 px-4 text-right text-green-500">
                    {idx > 0 ? `+${(((row.revenue - salesData[idx - 1].revenue) / salesData[idx - 1].revenue) * 100).toFixed(1)}%` : '-'}
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
