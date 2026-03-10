'use client';

import { useMemo, useState } from 'react';
import type { Order, OrderFilter, OrderMetrics } from '@/types/order';

// Mock data generator
const generateMockOrders = (count: number): Order[] => {
  const statuses = ['pending', 'approved', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
  const paymentStatuses = ['pending', 'paid', 'failed', 'refunded'] as const;
  
  return Array.from({ length: count }, (_, i) => ({
    id: `order-${i + 1}`,
    orderId: `ORD-${String(i + 1).padStart(6, '0')}`,
    userId: `user-${Math.floor(Math.random() * 100)}`,
    userName: `Customer ${i + 1}`,
    userEmail: `customer${i + 1}@example.com`,
    businessId: `business-${Math.floor(Math.random() * 50)}`,
    businessName: `Seller ${Math.floor(Math.random() * 50) + 1}`,
    totalAmount: Math.floor(Math.random() * 5000) + 100,
    items: [
      {
        id: `item-1`,
        productId: `product-${Math.floor(Math.random() * 1000)}`,
        productName: `Product ${Math.floor(Math.random() * 100)}`,
        quantity: Math.floor(Math.random() * 5) + 1,
        price: Math.floor(Math.random() * 500) + 10,
        total: Math.floor(Math.random() * 2500) + 50,
      },
    ],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
    paymentMethod: ['credit_card', 'debit_card', 'wallet', 'bank_transfer'][Math.floor(Math.random() * 4)],
    shippingAddress: {
      street: `${Math.floor(Math.random() * 999)} Main Street`,
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
    },
    billingAddress: {
      street: `${Math.floor(Math.random() * 999)} Main Street`,
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
    },
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    timeline: [],
    notes: Math.random() > 0.7 ? 'Requires review' : '',
    requiresManualApproval: Math.random() > 0.85,
  }));
};

export function useOrders(filters?: OrderFilter) {
  const [orders] = useState<Order[]>(() => generateMockOrders(50));
  const [isLoading] = useState(false);

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (filters?.status) {
      result = result.filter(o => o.status === filters.status);
    }
    if (filters?.paymentStatus) {
      result = result.filter(o => o.paymentStatus === filters.paymentStatus);
    }
    if (filters?.businessId) {
      result = result.filter(o => o.businessId === filters.businessId);
    }
    if (filters?.userId) {
      result = result.filter(o => o.userId === filters.userId);
    }

    return result;
  }, [orders, filters]);

  const metrics: OrderMetrics = useMemo(() => ({
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    avgOrderValue: orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    conversionRate: 3.2,
  }), [orders]);

  return {
    orders: filteredOrders,
    allOrders: orders,
    metrics,
    isLoading,
  };
}
