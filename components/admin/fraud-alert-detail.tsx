'use client';

import { AlertTriangle, Clock, Shield, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { FraudAlert } from '@/types/fraud';

interface FraudAlertDetailProps {
  alert: FraudAlert;
  onInvestigate?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

const severityIcons = {
  critical: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '🟢'
};

const severityBgColor = {
  critical: 'bg-red-500/20 border-red-500/40 text-red-400',
  high: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
  medium: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
  low: 'bg-primary/20 border-primary/40 text-primary'
};

const statusBadgeColor = {
  open: 'bg-red-500/30 text-red-300',
  investigating: 'bg-yellow-500/30 text-yellow-300',
  resolved: 'bg-green-500/30 text-green-300',
  false_positive: 'bg-slate-500/30 text-slate-300'
};

export function FraudAlertDetail({
  alert,
  onInvestigate,
  onApprove,
  onReject
}: FraudAlertDetailProps) {
  const riskLevel = alert.riskScore > 75 ? 'Critical' : alert.riskScore > 50 ? 'High' : alert.riskScore > 25 ? 'Medium' : 'Low';

  return (
    <Card className={`border-l-4 p-6 ${severityBgColor[alert.severity]}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-semibold">{alert.title}</h3>
              <Badge className={statusBadgeColor[alert.status]}>
                {alert.status.replace(/_/g, ' ')}
              </Badge>
            </div>
            <p className="text-sm opacity-80">{alert.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-bold">{alert.riskScore}%</div>
            <div className="text-xs opacity-75 mt-1">{riskLevel} Risk</div>
          </div>
        </div>

        {/* Entity Information */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div>
            <div className="text-xs opacity-60 uppercase tracking-wider">Entity Type</div>
            <div className="font-semibold capitalize">{alert.entityType}</div>
          </div>
          <div>
            <div className="text-xs opacity-60 uppercase tracking-wider">Entity ID</div>
            <div className="font-monospace text-sm">{alert.entityId}</div>
          </div>
          <div className="col-span-2">
            <div className="text-xs opacity-60 uppercase tracking-wider">Entity Name</div>
            <div className="font-semibold">{alert.entityName}</div>
          </div>
        </div>

        {/* Detected Flags */}
        {alert.flags.length > 0 && (
          <div className="pt-4 border-t border-white/10">
            <div className="text-xs opacity-60 uppercase tracking-wider mb-2">Detected Flags</div>
            <div className="flex flex-wrap gap-2">
              {alert.flags.map(flag => (
                <Badge key={flag} variant="outline" className="text-xs">
                  {flag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* AI Reasoning */}
        {alert.notes && (
          <div className="pt-4 border-t border-white/10">
            <div className="text-xs opacity-60 uppercase tracking-wider mb-2">AI Analysis</div>
            <div className="bg-black/30 rounded p-3 text-sm">
              {alert.notes}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 opacity-60" />
            <div>
              <div className="text-xs opacity-60">Detected</div>
              <div className="text-sm font-semibold">
                {new Date(alert.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          {alert.resolvedAt && (
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 opacity-60" />
              <div>
                <div className="text-xs opacity-60">Resolved</div>
                <div className="text-sm font-semibold">
                  {new Date(alert.resolvedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {alert.status === 'open' && (
          <div className="pt-4 border-t border-white/10 flex gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={onInvestigate}
              className="flex-1"
            >
              Start Investigation
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onApprove}
              className="flex-1"
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onReject}
              className="flex-1"
            >
              Reject
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
