'use client';

import { TrendingDown, TrendingUp, AlertCircle, CheckCircle2, Clock, BarChart3 } from 'lucide-react';
import { useFraudAlerts } from '@/hooks/useFraudAlerts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AlertSeverity, AlertStatus } from '@/types/fraud';

interface FraudDashboardProps {
  showChart?: boolean;
  timeRange?: '24h' | '7d' | '30d' | '90d';
}

export function FraudDashboard({ showChart = true, timeRange = '30d' }: FraudDashboardProps) {
  const { alerts, metrics, isLoading } = useFraudAlerts();

  const getSeverityColor = (severity: AlertSeverity) => {
    const colors = {
      critical: 'text-red-500',
      high: 'text-orange-500',
      medium: 'text-yellow-500',
      low: 'text-green-500',
    };
    return colors[severity];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-8 bg-muted rounded mb-2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Alerts */}
        <Card className="p-4 border-border/50 hover:border-border transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Total Alerts</div>
              <div className="text-2xl font-bold text-foreground mt-1">{metrics?.totalAlerts || 0}</div>
            </div>
            <AlertCircle className="w-5 h-5 text-muted-foreground opacity-50" />
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {metrics?.totalBookingAlerts || 0} bookings • {metrics?.totalOrderAlerts || 0} orders
          </div>
        </Card>

        {/* Open Alerts */}
        <Card className="p-4 border-red-500/20 bg-red-500/5 hover:border-red-500/40 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Open Alerts</div>
              <div className="text-2xl font-bold text-red-400 mt-1">{metrics?.openAlerts || 0}</div>
            </div>
            <TrendingUp className="w-5 h-5 text-red-500 opacity-50" />
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {metrics?.totalAlerts && metrics?.openAlerts ? Math.round((metrics.openAlerts / metrics.totalAlerts) * 100) : 0}% of total
          </div>
        </Card>

        {/* Critical Issues */}
        <Card className="p-4 border-orange-500/20 bg-orange-500/5 hover:border-orange-500/40 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Critical Issues</div>
              <div className="text-2xl font-bold text-orange-400 mt-1">{metrics?.criticalAlerts || 0}</div>
            </div>
            <AlertCircle className="w-5 h-5 text-orange-500 opacity-50" />
          </div>
          <div className="text-xs text-muted-foreground mt-2">Blocked level</div>
        </Card>

        {/* Resolution Rate */}
        <Card className="p-4 border-green-500/20 bg-green-500/5 hover:border-green-500/40 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Resolution Rate</div>
              <div className="text-2xl font-bold text-green-400 mt-1">
                {metrics?.totalAlerts && metrics?.resolvedAlerts ? Math.round((metrics.resolvedAlerts / metrics.totalAlerts) * 100) : 0}%
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-green-500 opacity-50" />
          </div>
          <div className="text-xs text-muted-foreground mt-2">{metrics?.resolvedAlerts || 0} resolved</div>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk Score & Performance */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Risk Assessment</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Average Risk Score</span>
                <span className="text-sm font-semibold text-foreground">{metrics?.avgRiskScore || 0}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full"
                  style={{ width: `${metrics?.avgRiskScore || 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Resolution Time</span>
                <span className="text-sm font-semibold text-foreground">{metrics?.avgResolutionTime?.toFixed(1) || 0}h</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">False Positive Rate</span>
                <span className="text-sm font-semibold text-foreground">{metrics?.falsePositiveRate?.toFixed(2) || 0}%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last 24 Hours</span>
              <Badge variant="outline">{metrics?.recentAlerts24h || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last 7 Days</span>
              <Badge variant="outline">{metrics?.recentAlerts7d || 0}</Badge>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">Avg per Day</span>
              <span className="text-sm font-semibold text-foreground">
                {metrics?.recentAlerts7d ? Math.round(metrics.recentAlerts7d / 7) : 0}
              </span>
            </div>
          </div>
        </Card>

        {/* Level Distribution */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Level Distribution</h3>
          <div className="space-y-3">
            {metrics?.levelBreakdown && Object.entries(metrics.levelBreakdown).map(([level, count]) => {
              const colors = {
                safe: 'bg-green-500/20 text-green-400',
                suspicious: 'bg-yellow-500/20 text-yellow-400',
                high_risk: 'bg-orange-500/20 text-orange-400',
                blocked: 'bg-red-500/20 text-red-400'
              };
              return (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground capitalize">{level.replace(/_/g, ' ')}</span>
                  <Badge className={`${colors[level as keyof typeof colors]}`}>
                    {count as number}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recommendation Breakdown */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Recommendations
          </h3>
          <div className="space-y-3">
            {metrics?.recommendationBreakdown && Object.entries(metrics.recommendationBreakdown).map(([rec, count]) => {
              const colors = {
                approve: 'bg-green-500/20 text-green-400',
                review: 'bg-yellow-500/20 text-yellow-400',
                reject: 'bg-red-500/20 text-red-400'
              };
              const icons = {
                approve: '✓',
                review: '◉',
                reject: '✕'
              };
              return (
                <div key={rec} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 flex items-center justify-center rounded text-sm font-bold ${colors[rec as keyof typeof colors]}`}>
                      {icons[rec as keyof typeof icons]}
                    </span>
                    <span className="text-sm capitalize">{rec}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{count as number}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Entity Type Breakdown */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            By Entity Type
          </h3>
          <div className="space-y-3">
            {metrics?.entityTypeBreakdown && Object.entries(metrics.entityTypeBreakdown).map(([type, count]) => {
              const colors = {
                booking: 'bg-blue-500/20 text-blue-400',
                order: 'bg-purple-500/20 text-purple-400'
              };
              const icons = {
                booking: '📅',
                order: '📦'
              };
              const total = metrics.totalAlerts || 1;
              const percentage = Math.round(((count as number) / total) * 100);
              return (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{icons[type as keyof typeof icons]}</span>
                      <span className="capitalize">{type}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{count as number}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${colors[type as keyof typeof colors]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-right">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
