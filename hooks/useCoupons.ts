'use client';

import { useMemo, useState } from 'react';
import type { Coupon, CouponFilter, CouponStatistics } from '@/types/coupon';

const generateMockCoupons = (count: number): Coupon[] => {
  const statuses = ['active', 'inactive', 'expired', 'scheduled'] as const;
  const discountTypes = ['percentage', 'fixed', 'freeShipping'] as const;

  return Array.from({ length: count }, (_, i) => ({
    id: `coupon-${i + 1}`,
    code: `PROMO${String(i + 1).padStart(3, '0')}`,
    description: `Discount coupon ${i + 1}`,
    discountType: discountTypes[Math.floor(Math.random() * discountTypes.length)],
    discountValue: Math.floor(Math.random() * 50) + 5,
    maxUses: Math.floor(Math.random() * 1000) + 100,
    currentUses: Math.floor(Math.random() * 500),
    minPurchaseAmount: Math.floor(Math.random() * 100) + 20,
    maxDiscountAmount: Math.floor(Math.random() * 500) + 50,
    applicableCategories: ['electronics', 'clothing', 'home'],
    applicableBusinesses: [],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'admin',
    isActive: Math.random() > 0.3,
  }));
};

export function useCoupons(filters?: CouponFilter) {
  const [coupons] = useState<Coupon[]>(() => generateMockCoupons(25));
  const [isLoading] = useState(false);

  const filteredCoupons = useMemo(() => {
    let result = coupons;

    if (filters?.status) {
      result = result.filter(c => c.status === filters.status);
    }
    if (filters?.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(c => c.code.toLowerCase().includes(query) || c.description.toLowerCase().includes(query));
    }

    return result;
  }, [coupons, filters]);

  const statistics: CouponStatistics = useMemo(() => ({
    totalCoupons: coupons.length,
    activeCoupons: coupons.filter(c => c.status === 'active').length,
    totalUsages: coupons.reduce((sum, c) => sum + c.currentUses, 0),
    totalDiscountGiven: coupons.reduce((sum, c) => sum + (c.discountValue * c.currentUses), 0),
    mostUsedCoupon: coupons.reduce((max, c) => c.currentUses > (max?.currentUses || 0) ? c : max, null),
  }), [coupons]);

  return {
    coupons: filteredCoupons,
    allCoupons: coupons,
    statistics,
    isLoading,
  };
}
