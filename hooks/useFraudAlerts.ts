'use client';

import { useMemo, useState } from 'react';
import type { FraudAlert, FraudFilter, FraudMetrics } from '@/types/fraud';

const generateMockAlerts = (count: number): FraudAlert[] => {
  const types = ['suspicious_activity', 'fake_review', 'unusual_spike', 'suspicious_seller', 'payment_fraud', 'bot_activity'] as const;
  const severities = ['critical', 'high', 'medium', 'low'] as const;
  const statuses = ['open', 'investigating', 'resolved', 'false_positive'] as const;
  const entityTypes = ['user', 'order', 'business', 'product', 'review'] as const;

  return Array.from({ length: count }, (_, i) => ({
    id: `alert-${i + 1}`,
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    title: `Fraud Alert ${i + 1}`,
    description: `Suspicious activity detected on entity`,
    entityType: entityTypes[Math.floor(Math.random() * entityTypes.length)],
    entityId: `entity-${Math.floor(Math.random() * 1000)}`,
    entityName: `Entity ${i + 1}`,
    riskScore: Math.floor(Math.random() * 100),
    flags: ['high_velocity', 'unusual_location', 'known_fraud_pattern'],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    resolvedAt: Math.random() > 0.5 ? new Date() : undefined,
    assignedTo: Math.random() > 0.3 ? 'admin@example.com' : undefined,
    notes: 'Investigating suspicious pattern',
  }));
};

export function useFraudAlerts(filters?: FraudFilter) {
  const [alerts] = useState<FraudAlert[]>(() => generateMockAlerts(30));
  const [isLoading] = useState(false);

  const filteredAlerts = useMemo(() => {
    let result = alerts;

    if (filters?.type) {
      result = result.filter(a => a.type === filters.type);
    }
    if (filters?.severity) {
      result = result.filter(a => a.severity === filters.severity);
    }
    if (filters?.status) {
      result = result.filter(a => a.status === filters.status);
    }
    if (filters?.entityType) {
      result = result.filter(a => a.entityType === filters.entityType);
    }

    return result.sort((a, b) => b.riskScore - a.riskScore);
  }, [alerts, filters]);

  const metrics: FraudMetrics = useMemo(() => {
    const resolved = alerts.filter(a => a.status === 'resolved');
    return {
      totalAlerts: alerts.length,
      openAlerts: alerts.filter(a => a.status === 'open').length,
      criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
      avgResolutionTime: 4.5,
      resolvedAlerts: resolved.length,
      falsePositiveRate: alerts.filter(a => a.status === 'false_positive').length / alerts.length,
    };
  }, [alerts]);

  return {
    alerts: filteredAlerts,
    allAlerts: alerts,
    metrics,
    isLoading,
  };
}
