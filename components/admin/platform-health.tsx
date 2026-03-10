'use client';

import { Activity, Database, Package, Zap } from 'lucide-react';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { Card } from '@/components/ui/card';

export function PlatformHealth() {
  const { health, isHealthy } = useSystemHealth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400 bg-green-500/20';
      case 'degraded':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'down':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Platform Health</h3>
          <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-green-400' : 'bg-red-400'}`} />
        </div>
        <span className="text-sm text-muted-foreground">Uptime: {health.status.uptime}%</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">API Status</span>
          </div>
          <div className={`px-3 py-2 rounded text-sm font-medium w-fit ${getStatusColor(health.status.apiStatus)}`}>
            {health.status.apiStatus.charAt(0).toUpperCase() + health.status.apiStatus.slice(1)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Database className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Database Latency</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{health.status.databaseLatency}ms</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Queue Workers</span>
          </div>
          <div className={`px-3 py-2 rounded text-sm font-medium w-fit ${getStatusColor(health.status.queueWorkerStatus)}`}>
            {health.status.queueWorkerStatus.charAt(0).toUpperCase() + health.status.queueWorkerStatus.slice(1)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Failed Jobs</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{health.status.failedJobsCount}</div>
        </div>
      </div>

      <div className="border-t border-border mt-4 pt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Requests/sec</span>
          <div className="text-lg font-semibold text-foreground">{health.metrics.requestsPerSecond}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Avg Response Time</span>
          <div className="text-lg font-semibold text-foreground">{health.metrics.avgResponseTime}ms</div>
        </div>
        <div>
          <span className="text-muted-foreground">Error Rate</span>
          <div className="text-lg font-semibold text-foreground">{health.metrics.errorRate.toFixed(2)}%</div>
        </div>
        <div>
          <span className="text-muted-foreground">Active Connections</span>
          <div className="text-lg font-semibold text-foreground">{health.metrics.activeConnections}</div>
        </div>
      </div>
    </Card>
  );
}
