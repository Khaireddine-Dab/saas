'use client';

import { useMemo, useState } from 'react';
import type { Order } from '@/types/order';
import type { OrderFilter, OrderAnalytics } from '@/types/order-extended';

export function useOrderFilters(orders: Order[], initialFilters?: OrderFilter) {
  const [filters, setFilters] = useState<OrderFilter>(initialFilters || {});

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      result = result.filter(order => filters.status!.includes(order.status));
    }

    // Filter by payment status
    if (filters.paymentStatus && filters.paymentStatus.length > 0) {
      result = result.filter(order => filters.paymentStatus!.includes(order.paymentStatus));
    }

    // Filter by payment method
    if (filters.paymentMethod && filters.paymentMethod.length > 0) {
      result = result.filter(order => filters.paymentMethod!.includes(order.paymentMethod));
    }

    // Filter by date range
    if (filters.dateRange) {
      result = result.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= filters.dateRange!.from && orderDate <= filters.dateRange!.to;
      });
    }

    // Filter by price range
    if (filters.priceRange) {
      result = result.filter(order => {
        if (filters.priceRange!.min && order.totalAmount < filters.priceRange!.min) {
          return false;
        }
        if (filters.priceRange!.max && order.totalAmount > filters.priceRange!.max) {
          return false;
        }
        return true;
      });
    }

    // Filter by customer ID
    if (filters.customerId) {
      result = result.filter(order => order.userId === filters.customerId);
    }

    // Filter by merchant ID
    if (filters.merchantId) {
      result = result.filter(order => order.businessId === filters.merchantId);
    }

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(order =>
        order.orderId.toLowerCase().includes(query) ||
        order.userName.toLowerCase().includes(query) ||
        order.userEmail.toLowerCase().includes(query)
      );
    }

    return result;
  }, [orders, filters]);

  const analytics: OrderAnalytics = useMemo(() => {
    const total = filteredOrders.length;
    const pending = filteredOrders.filter(o => o.status === 'pending').length;
    const processed = filteredOrders.filter(o =>
      ['approved', 'processing', 'shipped', 'delivered'].includes(o.status)
    ).length;
    const cancelled = filteredOrders.filter(o => o.status === 'cancelled').length;

    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const avgValue = total > 0 ? totalRevenue / total : 0;

    // Status distribution
    const statusDist: Record<string, number> = {};
    filteredOrders.forEach(order => {
      statusDist[order.status] = (statusDist[order.status] || 0) + 1;
    });

    // Top payment method
    const paymentMethodCounts: Record<string, number> = {};
    filteredOrders.forEach(order => {
      paymentMethodCounts[order.paymentMethod] = (paymentMethodCounts[order.paymentMethod] || 0) + 1;
    });
    const topPaymentMethod = Object.entries(paymentMethodCounts).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0] || 'N/A';

    // Repeat customers
    const customerOrders: Record<string, number> = {};
    filteredOrders.forEach(order => {
      customerOrders[order.userId] = (customerOrders[order.userId] || 0) + 1;
    });
    const repeatCustomers = Object.values(customerOrders).filter(count => count > 1).length;

    return {
      totalOrders: total,
      pendingOrders: pending,
      processedOrders: processed,
      cancelledOrders: cancelled,
      avgOrderValue: avgValue,
      totalRevenue,
      avgFulfillmentTime: 24, // Mock value
      refundRate: filteredOrders.length > 0 
        ? (filteredOrders.filter(o => o.status === 'refunded').length / filteredOrders.length) * 100
        : 0,
      statusDistribution: statusDist,
      peakOrderHour: 14, // Mock value
      topPaymentMethod,
      repeatCustomers,
    };
  }, [filteredOrders]);

  return {
    filteredOrders,
    filters,
    setFilters,
    analytics,
  };
}
