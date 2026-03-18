'use client';

import React from 'react';
import { KPICard } from '@/components/dashboard/kpi-card';
import { ChartCard } from '@/components/dashboard/chart-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { mockKPIs, mockAnalyticsMetrics } from '@/lib/dashboard-data';
import {
  Users,
  Briefcase,
  Package,
  Search,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  ShoppingBag,
  Clock,
  Truck,
  XCircle,
  PlusSquare,
  Store,
  UserCheck,
  Settings2,
  Layers,
  Layout,
  Tag,
  Box,
  Percent,
  Ticket,
  Star,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartLegend } from '@/components/ui/chart';
import { AdminCommandSearch } from '@/components/admin/admin-command-search';
import { FraudAlertPanel } from '@/components/admin/fraud-alert-panel';
import { PlatformHealth } from '@/components/admin/platform-health';
import { RevenueIntelligence } from '@/components/admin/revenue-intelligence';
import { BusinessInsights } from '@/components/admin/business-insights';

export default function DashboardPage() {
  const [userGrowth] = React.useState(mockAnalyticsMetrics);
  const [businessGrowth] = React.useState(
    mockAnalyticsMetrics.map((item) => ({
      ...item,
      value: Math.floor(item.value * 0.15),
    }))
  );

  const topCategoriesData = [
    { category: 'Restaurants', value: 45200 },
    { category: 'Retail', value: 38900 },
    { category: 'Healthcare', value: 32100 },
    { category: 'Technology', value: 28500 },
    { category: 'Education', value: 25600 },
  ];

  const searchVolumeData = [
    { date: 'Jan 1', volume: 12000 },
    { date: 'Jan 8', volume: 15200 },
    { date: 'Jan 15', volume: 18400 },
    { date: 'Jan 22', volume: 21100 },
    { date: 'Jan 29', volume: 25300 },
    { date: 'Feb 5', volume: 28900 },
    { date: 'Feb 12', volume: 32100 },
  ];

  return (
    <div className="space-y-8">
      {/* Command Search */}
      <AdminCommandSearch />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here is your platform overview.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {mockKPIs.map((kpi) => {
          const iconMap: Record<string, React.ReactNode> = {
            users: <Users className="w-5 h-5" />,
            'user-plus': <UserPlus className="w-5 h-5" />,
            'shopping-bag': <ShoppingBag className="w-5 h-5" />,
            clock: <Clock className="w-5 h-5" />,
            truck: <Truck className="w-5 h-5" />,
            'check-circle': <CheckCircle2 className="w-5 h-5" />,
            'x-circle': <XCircle className="w-5 h-5" />,
            'plus-square': <PlusSquare className="w-5 h-5" />,
            store: <Store className="w-5 h-5" />,
            'user-check': <UserCheck className="w-5 h-5" />,
            'settings-2': <Settings2 className="w-5 h-5" />,
            layers: <Layers className="w-5 h-5" />,
            layout: <Layout className="w-5 h-5" />,
            tag: <Tag className="w-5 h-5" />,
            box: <Box className="w-5 h-5" />,
            percent: <Percent className="w-5 h-5" />,
            ticket: <Ticket className="w-5 h-5" />,
            star: <Star className="w-5 h-5" />,
            briefcase: <Briefcase className="w-5 h-5" />,
            package: <Package className="w-5 h-5" />,
            search: <Search className="w-5 h-5" />,
            'trending-up': <TrendingUp className="w-5 h-5" />,
            'dollar-sign': <AlertCircle className="w-5 h-5" />,
            activity: <Activity className="w-5 h-5" />,
          };

          return (
            <KPICard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              change={kpi.change}
              percentageChange={kpi.percentageChange}
              trend={kpi.trend as "up" | "down" | "stable"}
              icon={iconMap[kpi.icon || 'activity']}
            />
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <ChartCard title="User Growth" description="Total users over time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Business Growth */}
        <ChartCard title="Business Growth" description="Active businesses over time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={businessGrowth}>
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
              <Line
                type="monotone"
                dataKey="value"
                stroke="#374151"
                strokeWidth={2}
                dot={{ fill: '#374151', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top Categories */}
        <ChartCard title="Top Categories" description="Search volume by category">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCategoriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Search Volume Trends */}
        <ChartCard title="Search Volume Trends" description="Daily search volume over time">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={searchVolumeData}>
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
              <Area
                type="monotone"
                dataKey="volume"
                fill="hsl(var(--muted))"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Activity and System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* System Health */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-foreground">Platform Uptime</span>
              </div>
              <span className="text-sm font-bold text-foreground">99.95%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-foreground">API Response</span>
              </div>
              <span className="text-sm font-bold text-foreground">234ms</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-foreground">Database Status</span>
              </div>
              <span className="text-sm font-bold text-foreground">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-foreground">Cache Memory</span>
              </div>
              <span className="text-sm font-bold text-foreground">78%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-foreground">Active Users</span>
              </div>
              <span className="text-sm font-bold text-foreground">2,456</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FraudAlertPanel limit={5} />
        <BusinessInsights />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlatformHealth />
        <RevenueIntelligence />
      </div>
    </div>
  );
}
