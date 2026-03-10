'use client';

import { AlertTriangle, ChevronRight, Shield } from 'lucide-react';
import { useFraudAlerts } from '@/hooks/useFraudAlerts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const severityColors = {
  critical: 'bg-red-500/20 border-red-500/40 text-red-400',
  high: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
  medium: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
  low: 'bg-primary/20 border-primary/40 text-primary',
};

const severityBadgeColors = {
  critical: 'bg-red-500/30 text-red-300',
  high: 'bg-orange-500/30 text-orange-300',
  medium: 'bg-yellow-500/30 text-yellow-300',
  low: 'bg-primary/30 text-primary',
};

interface FraudAlertPanelProps {
  limit?: number;
}

export function FraudAlertPanel({ limit = 5 }: FraudAlertPanelProps) {
  const { alerts, metrics } = useFraudAlerts({ status: 'open' });

  const displayedAlerts = alerts.slice(0, limit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-foreground">Fraud Alerts</h3>
          {metrics.openAlerts > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-destructive-foreground bg-destructive rounded-full">
              {metrics.openAlerts}
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm">
          View All <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {displayedAlerts.length > 0 ? (
          displayedAlerts.map(alert => (
            <div key={alert.id} className={`border rounded-lg p-3 ${severityColors[alert.severity]}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 flex-1">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{alert.title}</div>
                    <div className="text-xs opacity-75 mt-0.5">{alert.entityName}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${severityBadgeColors[alert.severity]}`}>
                        Risk: {alert.riskScore}%
                      </span>
                      <span className="text-xs opacity-75">{alert.type.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-2">
                Investigate
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">No active fraud alerts</div>
        )}
      </div>
    </div>
  );
}
