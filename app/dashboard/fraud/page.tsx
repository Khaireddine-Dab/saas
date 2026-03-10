'use client';

import { useState } from 'react';
import { AlertTriangle, Filter, Search, Shield } from 'lucide-react';
import { useFraudAlerts } from '@/hooks/useFraudAlerts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AlertSeverity, AlertStatus } from '@/types/fraud';

const severityColors: Record<AlertSeverity, string> = {
  critical: 'bg-red-500/20 text-red-500 border-red-500/40',
  high: 'bg-orange-500/20 text-orange-500 border-orange-500/40',
  medium: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
  low: 'bg-primary/20 text-primary border-primary/40',
};

const statusColors: Record<AlertStatus, string> = {
  open: 'bg-red-500/20 text-red-500 border-red-500/40',
  investigating: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
  resolved: 'bg-green-500/20 text-green-500 border-green-500/40',
  false_positive: 'bg-muted text-muted-foreground border-border/50',
};

export default function FraudAlertsPage() {
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | undefined>();
  const [statusFilter, setStatusFilter] = useState<AlertStatus | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const { alerts, metrics } = useFraudAlerts({ severity: severityFilter, status: statusFilter });

  const filteredAlerts = alerts.filter(alert =>
    alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.entityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fraud Detection System</h1>
          <p className="text-muted-foreground">Monitor and investigate suspicious marketplace activity</p>
        </div>
        <Button>
          <Shield className="w-4 h-4 mr-2" />
          Security Dashboard
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-destructive/20">
          <div className="text-sm text-muted-foreground">Total Alerts</div>
          <div className="text-2xl font-bold text-foreground">{metrics.totalAlerts}</div>
          <div className="text-xs text-muted-foreground mt-1">All time</div>
        </Card>
        <Card className="p-4 border-destructive/20">
          <div className="text-sm text-muted-foreground">Open Alerts</div>
          <div className="text-2xl font-bold text-destructive">{metrics.openAlerts}</div>
          <div className="text-xs text-muted-foreground mt-1">Requiring action</div>
        </Card>
        <Card className="p-4 border-destructive/20">
          <div className="text-sm text-muted-foreground">Critical Issues</div>
          <div className="text-2xl font-bold text-destructive">{metrics.criticalAlerts}</div>
          <div className="text-xs text-muted-foreground mt-1">High priority</div>
        </Card>
        <Card className="p-4 border-destructive/20">
          <div className="text-sm text-muted-foreground">False Positive Rate</div>
          <div className="text-2xl font-bold text-foreground">{(metrics.falsePositiveRate * 100).toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground mt-1">System accuracy</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts by title or entity..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={severityFilter || ''}
              onChange={e => setSeverityFilter(e.target.value as AlertSeverity || undefined)}
              className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground hover:bg-muted transition-colors"
            >
              <option value="">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={statusFilter || ''}
              onChange={e => setStatusFilter(e.target.value as AlertStatus || undefined)}
              className="px-3 py-2 rounded-lg border border_border text-sm bg-background text-foreground hover:bg-muted transition-colors"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="false_positive">False Positive</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.slice(0, 15).map(alert => (
            <Card key={alert.id} className="p-4 border-l-4 border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className={`w-5 h-5 ${alert.severity === 'critical' ? 'text-red-500' : alert.severity === 'high' ? 'text-orange-500' : 'text-yellow-500'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={severityColors[alert.severity]}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-sm">
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{alert.entityType}:</strong> {alert.entityName}
                    </span>
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Risk Score:</strong> {alert.riskScore}%
                    </span>
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Status:</strong> {alert.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {alert.flags.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {alert.flags.slice(0, 3).map(flag => (
                        <Badge key={flag} variant="outline" className="text-xs">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button size="sm" className="flex-shrink-0">Investigate</Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center text-neutral-500">
            No fraud alerts found
          </Card>
        )}
      </div>
    </div>
  );
}
