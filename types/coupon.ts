export type DiscountType = 'percentage' | 'fixed' | 'freeShipping';
export type CouponStatus = 'active' | 'inactive' | 'expired' | 'scheduled';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  maxUses: number;
  currentUses: number;
  minPurchaseAmount: number;
  maxDiscountAmount?: number;
  applicableCategories: string[];
  applicableBusinesses: string[];
  status: CouponStatus;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
}

export interface CouponStatistics {
  totalCoupons: number;
  activeCoupons: number;
  totalUsages: number;
  totalDiscountGiven: number;
  mostUsedCoupon: Coupon | null;
}

export interface CouponValidation {
  valid: boolean;
  message: string;
  discount?: number;
}

export interface CouponFilter {
  status?: CouponStatus;
  businessId?: string;
  search?: string;
}
