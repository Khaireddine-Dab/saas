import type { Promotion } from '@/types/promotion';
import type { Coupon } from '@/types/coupon';

/**
 * Map a promotion from the backend API to the Coupon format
 * Transformations:
 * - title → code (formatted as promo code)
 * - description → description
 * - discount_percent or discount_text → discountType & discountValue
 * - Date comparison → status
 */
export function mapPromotionToCoupon(promotion: Promotion): Coupon {
  const now = new Date();
  const startDate = new Date(promotion.valid_from);
  const endDate = new Date(promotion.valid_until);

  // Determine status
  let status: 'active' | 'inactive' | 'expired' | 'scheduled';
  if (!promotion.active) {
    status = 'inactive';
  } else if (endDate < now) {
    status = 'expired';
  } else if (startDate > now) {
    status = 'scheduled';
  } else {
    status = 'active';
  }

  // Determine discount type and value
  let discountType: 'percentage' | 'fixed' | 'freeShipping' = 'percentage';
  let discountValue = 0;

  if (promotion.discount_percent) {
    discountType = 'percentage';
    discountValue = promotion.discount_percent;
  } else if (promotion.discount_text) {
    if (promotion.discount_text.toLowerCase().includes('free shipping') ||
        promotion.discount_text.toLowerCase().includes('gratuit')) {
      discountType = 'freeShipping';
      discountValue = 0;
    } else {
      // Try to extract number from custom text
      const match = promotion.discount_text.match(/\d+/);
      discountType = 'fixed';
      discountValue = match ? parseInt(match[0]) : 0;
    }
  }

  // Generate a coupon-like code from the title
  const couponCode = promotion.title
    .toUpperCase()
    .replace(/\s+/g, '')
    .substring(0, 12)
    .padEnd(8, String(promotion.id % 10))
    .substring(0, 12);

  return {
    id: `promo-${promotion.id}`,
    code: couponCode,
    description: promotion.description || promotion.title,
    discountType,
    discountValue,
    maxUses: 9999, // Promotions API doesn't track uses
    currentUses: 0,
    minPurchaseAmount: 0,
    maxDiscountAmount: discountType === 'percentage' ? undefined : discountValue,
    applicableCategories: promotion.apply_to_all ? ['all'] : [],
    applicableBusinesses: [`store-${promotion.store_id}`],
    status,
    startDate,
    endDate,
    createdAt: new Date(promotion.created_at),
    updatedAt: new Date(promotion.created_at),
    createdBy: 'admin',
    isActive: promotion.active && now >= startDate && now <= endDate,
  };
}

/**
 * Map multiple promotions to coupons
 */
export function mapPromotionsToCoupons(promotions: Promotion[]): Coupon[] {
  return promotions.map(mapPromotionToCoupon);
}
