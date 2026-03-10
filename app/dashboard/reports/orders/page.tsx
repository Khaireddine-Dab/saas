'use client';

import { Calendar, Download, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const orderTrendData = [
  { date: 'Mon', total: 120, completed: 95, cancelled: 8, pending: 17 },
  { date: 'Tue', total: 155, completed: 125, cancelled: 12, pending: 18 },
  { date: 'Wed', total: 140, completed: 110, cancelled: 15, pending: 15 },
  { date: 'Thu', total: 175, completed: 145, cancelled: 10, pending: 20 },
  { date: 'Fri', total: 210, completed: 175, cancelled: 18, pending: 17 },
  { date: 'Sat', total: 240, completed: 210, cancelled: 15, pending: 15 },
  { date: 'Sun', total: 190, completed: 165, cancelled: 12, pending: 13 },
];

const statusDistribution = [
  { name: 'Delivered', value: 68, count: 1130 },
  { name: 'Processing', value: 15, count: 250 },
  { name: 'Cancelled', value: 10, count: 167 },
  { name: 'Pending', value: 7, count: 117 },
];

const peakHours = [
  { hour: '6 AM', orders: 25 },
  { hour: '9 AM', orders: 45 },
  { hour: '12 PM', orders: 85 },
  { hour: '3 PM', orders: 95 },
  { hour: '6 PM', orders: 110 },
  { hour: '9 PM', orders: 75 },
  { hour: '12 AM', orders: 35 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--primary) / 0.8)', 'hsl(var(--primary) / 0.6)', 'hsl(var(--primary) / 0.4)'];

export default function OrdersReportPage() {
  const totalOrders = orderTrendData.reduce((sum, item) => sum + item.total, 0);
  const completedOrders = orderTrendData.reduce((sum, item) => sum + item.completed, 0);
  const fulfillmentRate = (completedOrders / totalOrders * 100).toFixed(1);
  const avgFulfillmentTime = 24;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders Report</h1>
          <p className="text-muted-foreground">Order volume, status distribution, and fulfillment metrics</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Orders</div>
          <div className="text-2xl font-bold text-foreground">{totalOrders.toLocaleString()}</div>
          <div className="text-xs text-green-500 mt-1">+15.3% vs last week</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Fulfillment Rate</div>
          <div className="text-2xl font-bold text-green-500">{fulfillmentRate}%</div>
          <div className="text-xs text-muted-foreground mt-1">{completedOrders.toLocaleString()} delivered</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg Fulfillment Time</div>
          <div className="text-2xl font-bold text-foreground">{avgFulfillmentTime}h</div>
          <div className="text-xs text-muted-foreground mt-1">Order to delivery</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Cancellation Rate</div>
          <div className="text-2xl font-bold text-destructive">2.8%</div>
          <div className="text-xs text-muted-foreground mt-1">47 cancelled</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Trend */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Order Volume Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderTrendData}>
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
              />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" name="Total" strokeWidth={2} />
              <Line type="monotone" dataKey="completed" stroke="hsl(var(--primary) / 0.8)" name="Completed" />
              <Line type="monotone" dataKey="pending" stroke="hsl(var(--primary) / 0.6)" name="Pending" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Status Distribution */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="hsl(var(--primary))"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
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
      </div>

      {/* Peak Hours */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Orders by Hour</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={peakHours}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))'
              }}
            />
            <Bar dataKey="orders" fill="hsl(var(--primary))" name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Status Details */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Order Status Details</h3>
        <div className="space-y-3">
          {statusDistribution.map((status) => (
            <div key={status.name} className="flex items-center justify-between p-3 bg-muted rounded border border-border">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[statusDistribution.indexOf(status)] }}></div>
                <div>
                  <p className="font-medium">{status.name}</p>
                  <p className="text-xs text-muted-foreground">{status.count.toLocaleString()} orders</p>
                </div>
              </div>
              <p className="font-bold text-lg">{status.value}%</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
