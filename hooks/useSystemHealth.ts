'use client';

import { useState } from 'react';
import type { SystemStatus, PlatformHealth, HealthMetrics } from '@/types/system';

export function useSystemHealth() {
  const [health] = useState<PlatformHealth>({
    timestamp: new Date(),
    status: {
      apiStatus: 'healthy',
      databaseLatency: Math.floor(Math.random() * 50) + 10,
      queueWorkerStatus: 'healthy',
      failedJobsCount: Math.floor(Math.random() * 5),
      uptime: 99.98,
    },
    metrics: {
      requestsPerSecond: Math.floor(Math.random() * 500) + 100,
      errorRate: Math.random() * 0.5,
      avgResponseTime: Math.floor(Math.random() * 200) + 50,
      activeConnections: Math.floor(Math.random() * 1000) + 200,
    },
  });

  return {
    health,
    isHealthy: health.status.apiStatus === 'healthy',
  };
}

export function useRevenueIntelligence() {
  const [revenue] = useState({
    totalRevenue: 1250000,
    avgOrderValue: 285.5,
    topCategories: [
      { category: 'Electronics', revenue: 450000, percentage: 36, orders: 1200 },
      { category: 'Fashion', revenue: 380000, percentage: 30.4, orders: 1580 },
      { category: 'Home & Garden', revenue: 280000, percentage: 22.4, orders: 680 },
      { category: 'Sports', revenue: 140000, percentage: 11.2, orders: 420 },
    ],
    highValueCustomers: [
      { id: 'customer-1', name: 'Premium Client A', totalSpend: 45000, orderCount: 120, avgOrderValue: 375 },
      { id: 'customer-2', name: 'Premium Client B', totalSpend: 38000, orderCount: 98, avgOrderValue: 388 },
      { id: 'customer-3', name: 'Premium Client C', totalSpend: 32000, orderCount: 85, avgOrderValue: 376 },
    ],
    forecast30Day: 1520000,
  });

  return revenue;
}

export function useBusinessInsights() {
  const [insights] = useState({
    topBusinesses: [
      { id: 'biz-1', name: 'TechHub Store', revenue: 125000, growth: 45.2, status: 'active' },
      { id: 'biz-2', name: 'Fashion Forward', revenue: 98000, growth: 32.1, status: 'active' },
      { id: 'biz-3', name: 'Electronics Pro', revenue: 87000, growth: 28.5, status: 'active' },
    ],
    fastestGrowing: [
      { id: 'biz-4', name: 'New Seller Co', revenue: 25000, growth: 156.3, status: 'active' },
      { id: 'biz-5', name: 'Rising Star Retail', revenue: 45000, growth: 98.7, status: 'active' },
    ],
    losingTraffic: [
      { id: 'biz-6', name: 'Legacy Store', revenue: 15000, growth: -25.4, status: 'needs_review' },
    ],
  });

  return insights;
}
