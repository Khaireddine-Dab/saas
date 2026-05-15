'use client';

import { useMemo, useState, useEffect } from 'react';
import type { FraudAlert, FraudFilter, FraudMetrics } from '@/types/fraud';
import { fraudApi } from '@/lib/api';

export function useFraudAlerts(filters?: FraudFilter) {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [metrics, setMetrics] = useState<FraudMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [alertsData, metricsData] = await Promise.all([
          fraudApi.getAll(),
          fraudApi.getMetrics()
        ]);
        setAlerts(alertsData);
        setMetrics(metricsData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch fraud alerts');
        console.error('Error fetching fraud alerts:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

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

  const displayMetrics: FraudMetrics = metrics || {
    totalAlerts: alerts.length,
    openAlerts: alerts.filter(a => a.status === 'open').length,
    criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
    avgResolutionTime: 4.5,
    resolvedAlerts: alerts.filter(a => a.status === 'resolved').length,
    falsePositiveRate: alerts.length > 0 ? alerts.filter(a => a.status === 'false_positive').length / alerts.length : 0,
  };

  return {
    alerts: filteredAlerts,
    allAlerts: alerts,
    metrics: displayMetrics,
    isLoading,
    error,
  };
}
