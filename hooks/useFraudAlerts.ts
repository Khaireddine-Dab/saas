'use client';

import { useMemo, useState, useEffect } from 'react';
import type { FraudAlert, FraudFilter, FraudMetrics } from '@/types/fraud';
import { fraudApi } from '@/lib/api';

export function useFraudAlerts(filters?: FraudFilter) {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [metrics, setMetrics] = useState<FraudMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchData();
  }, []);

  const approveAlert = async (id: string) => {
    try {
      await fraudApi.approve(id);
      await fetchData();
    } catch (err: any) {
      console.error('Failed to approve alert:', err);
      throw err;
    }
  };

  const rejectAlert = async (id: string) => {
    try {
      await fraudApi.reject(id);
      await fetchData();
    } catch (err: any) {
      console.error('Failed to reject alert:', err);
      throw err;
    }
  };

  const reviewAlert = async (id: string, reasoning?: string) => {
    try {
      await fraudApi.review(id, reasoning);
      await fetchData();
    } catch (err: any) {
      console.error('Failed to review alert:', err);
      throw err;
    }
  };

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
    falsePositiveRate: alerts.length > 0 ? (alerts.filter(a => a.status === 'false_positive').length / alerts.length) * 100 : 0,
    totalBookingAlerts: alerts.filter(a => a.entityType === 'booking' as any).length,
    totalOrderAlerts: alerts.filter(a => a.entityType === 'order' as any).length,
    avgRiskScore: alerts.length > 0 ? alerts.reduce((acc, a) => acc + a.riskScore, 0) / alerts.length : 0,
    recentAlerts24h: alerts.filter(a => (new Date().getTime() - new Date(a.createdAt).getTime()) < 24 * 3600 * 1000).length,
    recentAlerts7d: alerts.filter(a => (new Date().getTime() - new Date(a.createdAt).getTime()) < 7 * 24 * 3600 * 1000).length,
    levelBreakdown: {
      safe: alerts.filter(a => a.severity === 'low').length,
      suspicious: alerts.filter(a => a.severity === 'medium').length,
      high_risk: alerts.filter(a => a.severity === 'high').length,
      blocked: alerts.filter(a => a.severity === 'critical').length,
    },
    recommendationBreakdown: {
      approve: alerts.filter(a => a.status === 'resolved').length,
      review: alerts.filter(a => a.status === 'investigating').length,
      reject: alerts.filter(a => a.status === 'open').length,
    },
    entityTypeBreakdown: {
      booking: alerts.filter(a => a.entityType === 'booking' as any).length,
      order: alerts.filter(a => a.entityType === 'order' as any).length,
    }
  };

  return {
    alerts: filteredAlerts,
    allAlerts: alerts,
    metrics: displayMetrics,
    isLoading,
    error,
    refetch: fetchData,
    approveAlert,
    rejectAlert,
    reviewAlert
  };
}
