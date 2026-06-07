'use client';

import { useState } from 'react';
import { X, AlertTriangle, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FraudAlert } from '@/types/fraud';

interface FraudAlertModalProps {
  isOpen: boolean;
  alert: FraudAlert | null;
  onClose: () => void;
  onApprove?: () => Promise<void>;
  onReject?: () => Promise<void>;
  onInvestigate?: () => Promise<void>;
}

const severityBgColor = {
  critical: 'bg-red-500/20 border-red-500/40',
  high: 'bg-orange-500/20 border-orange-500/40',
  medium: 'bg-yellow-500/20 border-yellow-500/40',
  low: 'bg-green-500/20 border-green-500/40'
};

const statusBadgeColor = {
  open: 'bg-red-500/30 text-red-300',
  investigating: 'bg-yellow-500/30 text-yellow-300',
  resolved: 'bg-green-500/30 text-green-300',
  false_positive: 'bg-slate-500/30 text-slate-300'
};

export function FraudAlertModal({
  isOpen,
  alert,
  onClose,
  onApprove,
  onReject,
  onInvestigate,
}: FraudAlertModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !alert) return null;

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await onApprove?.();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await onReject?.();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvestigate = async () => {
    setIsLoading(true);
    try {
      await onInvestigate?.();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto border-l-4 ${severityBgColor[alert.severity]}`}>
        {/* Header */}
        <div className="sticky top-0 border-b border-border bg-card/80 backdrop-blur-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <h2 className="font-semibold text-foreground">{alert.title}</h2>
              <p className="text-xs text-muted-foreground">{alert.type.replace(/_/g, ' ')}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Risk Score & Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs opacity-60 uppercase tracking-wider mb-1">Risk Score</div>
              <div className="text-3xl font-bold text-foreground">{alert.riskScore}%</div>
            </div>
            <div>
              <div className="text-xs opacity-60 uppercase tracking-wider mb-1">Severity</div>
              <Badge className="text-xs capitalize">{alert.severity}</Badge>
            </div>
            <div>
              <div className="text-xs opacity-60 uppercase tracking-wider mb-1">Status</div>
              <Badge className={statusBadgeColor[alert.status]} style={{whiteSpace: 'nowrap'}}>
                {alert.status.replace(/_/g, ' ')}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-white/10 pt-4">
            <div className="text-xs opacity-60 uppercase tracking-wider mb-2">Description</div>
            <p className="text-sm text-foreground">{alert.description}</p>
          </div>

          {/* Entity Information */}
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
            <div>
              <div className="text-xs opacity-60 uppercase tracking-wider mb-1">Entity Type</div>
              <div className="font-semibold capitalize">{alert.entityType}</div>
            </div>
            <div>
              <div className="text-xs opacity-60 uppercase tracking-wider mb-1">Entity ID</div>
              <div className="font-monospace text-sm text-muted-foreground">{alert.entityId}</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs opacity-60 uppercase tracking-wider mb-1">Entity Name</div>
              <div className="font-semibold text-foreground">{alert.entityName}</div>
            </div>
          </div>

          {/* Flags */}
          {alert.flags.length > 0 && (
            <div className="border-t border-white/10 pt-4">
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

          {/* AI Analysis */}
          {alert.notes && (
            <div className="border-t border-white/10 pt-4">
              <div className="text-xs opacity-60 uppercase tracking-wider mb-2">AI Analysis</div>
              <div className="bg-black/30 rounded p-3 text-sm text-foreground">
                {alert.notes}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs opacity-60 uppercase tracking-wider mb-1">Detected</div>
              <div className="text-sm font-semibold text-foreground">
                {new Date(alert.createdAt).toLocaleDateString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(alert.createdAt).toLocaleTimeString()}
              </div>
            </div>
            {alert.resolvedAt && (
              <div>
                <div className="text-xs opacity-60 uppercase tracking-wider mb-1">Resolved</div>
                <div className="text-sm font-semibold text-green-400">
                  {new Date(alert.resolvedAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(alert.resolvedAt).toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {alert.status === 'open' && (
            <div className="border-t border-white/10 pt-4 flex gap-2">
              <Button
                className="flex-1"
                onClick={handleInvestigate}
                disabled={isLoading}
              >
                Start Investigation
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={handleApprove}
                disabled={isLoading}
              >
                Approve
              </Button>
              <Button
                className="flex-1"
                variant="destructive"
                onClick={handleReject}
                disabled={isLoading}
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
