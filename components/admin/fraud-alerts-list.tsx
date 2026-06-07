'use client';

import { AlertTriangle, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FraudAlert } from '@/types/fraud';

interface FraudAlertsListProps {
  alerts: FraudAlert[];
  isLoading?: boolean;
  onSelectAlert?: (alert: FraudAlert) => void;
  onInvestigate?: (alert: FraudAlert) => void;
  maxItems?: number;
  showViewAll?: boolean;
}

const severityColors = {
  critical: 'border-l-red-500',
  high: 'border-l-orange-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-green-500',
};

const severityTextColors = {
  critical: 'text-red-500',
  high: 'text-orange-500',
  medium: 'text-yellow-500',
  low: 'text-green-500',
};

const statusBadgeColors = {
  open: 'bg-red-500/30 text-red-300',
  investigating: 'bg-yellow-500/30 text-yellow-300',
  resolved: 'bg-green-500/30 text-green-300',
  false_positive: 'bg-slate-500/30 text-slate-300',
};

export function FraudAlertsList({
  alerts,
  isLoading = false,
  onSelectAlert,
  onInvestigate,
  maxItems,
  showViewAll = true,
}: FraudAlertsListProps) {
  const displayedAlerts = maxItems ? alerts.slice(0, maxItems) : alerts;
  const hasMore = maxItems && alerts.length > maxItems;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-8 bg-muted rounded mb-2" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  if (displayedAlerts.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
        <p className="text-muted-foreground">No fraud alerts found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {displayedAlerts.map((alert) => (
        <Card
          key={alert.id}
          className={`p-4 border-l-4 ${severityColors[alert.severity]} hover:bg-muted/50 transition-colors cursor-pointer`}
          onClick={() => onSelectAlert?.(alert)}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-1">
              <AlertTriangle className={`w-5 h-5 ${severityTextColors[alert.severity]}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-1">
                <h4 className="font-semibold text-foreground text-sm truncate">
                  {alert.title}
                </h4>
                <Badge className={statusBadgeColors[alert.status]} style={{whiteSpace: 'nowrap'}}>
                  {alert.status.replace(/_/g, ' ')}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {alert.description}
              </p>

              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span className="font-medium">
                  Risk: <span className={severityTextColors[alert.severity]}>{alert.riskScore}%</span>
                </span>
                <span>•</span>
                <span>{alert.entityType}: {alert.entityName}</span>
                <span>•</span>
                <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
              </div>

              {alert.flags.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {alert.flags.slice(0, 2).map(flag => (
                    <Badge key={flag} variant="outline" className="text-xs">
                      {flag}
                    </Badge>
                  ))}
                  {alert.flags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{alert.flags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <div className="flex-shrink-0 flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAlert?.(alert);
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onInvestigate?.(alert);
                }}
              >
                Investigate
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {hasMore && showViewAll && (
        <Card className="p-4 text-center border-dashed">
          <Button variant="outline" className="w-full">
            View all {alerts.length} alerts
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      )}
    </div>
  );
}
