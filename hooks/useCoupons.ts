'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Coupon, CouponFilter, CouponStatistics } from '@/types/coupon';
import { mapPromotionsToCoupons } from '@/lib/promotion-mapper';

export function useCoupons(filters?: CouponFilter) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch promotions from backend API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/promotions/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch promotions: ${response.statusText}`);
        }

        const data = await response.json();
        const promotions = Array.isArray(data) ? data : data.results || [];
        
        // Map promotions to coupon format
        const mappedCoupons = mapPromotionsToCoupons(promotions);
        setCoupons(mappedCoupons);
      } catch (err) {
        console.error('[useCoupons] Error fetching promotions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch coupons');
        setCoupons([]); // Fallback to empty list on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, []);

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
    error,
  };
}
