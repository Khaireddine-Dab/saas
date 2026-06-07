import type { Review } from '@/types/review';
import type { ReviewWithMetrics } from '@/types/review-extended';

/**
 * Helper to safely parse dates
 */
const parseDate = (dateValue: any): Date => {
  if (!dateValue) return new Date();
  const parsed = new Date(dateValue);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

/**
 * Map backend review to frontend Review type
 */
export function mapBackendReviewToFrontend(backendReview: any): ReviewWithMetrics {
  // Determine status based on is_approved and is_spam flags
  let status: 'pending' | 'approved' | 'rejected' | 'spam' = 'pending';
  if (backendReview.is_spam) {
    status = 'spam';
  } else if (backendReview.is_approved) {
    status = 'approved';
  }

  // Create base review object
  const review: ReviewWithMetrics = {
    id: String(backendReview.id || ''),
    productId: String(backendReview.item || ''),
    productName: backendReview.item_details?.name || 'Unknown Product',
    businessId: String(backendReview.store || ''),
    businessName: backendReview.store_details?.name || 'Unknown Store',
    userId: String(backendReview.author || ''),
    userName: backendReview.author_details?.name || 'Unknown User',
    rating: backendReview.rating || 0,
    title: backendReview.title || '',
    content: backendReview.comment || '',
    status: status,
    spamScore: 0, // Not directly available from backend
    riskLevel: 'low', // Not directly available from backend
    flagged: false, // Not directly available from backend
    flagCount: 0, // Not directly available from backend
    helpful: 0, // Not directly available from backend
    unhelpful: 0, // Not directly available from backend
    verified: backendReview.is_verified || false,
    createdAt: parseDate(backendReview.created_at),
    updatedAt: parseDate(backendReview.updated_at),
    
    // Extended details
    authorDetails: backendReview.author_details && {
      id: String(backendReview.author_details.id || ''),
      name: backendReview.author_details.name || '',
      email: backendReview.author_details.email || '',
    },
    itemDetails: backendReview.item_details && {
      id: String(backendReview.item_details.id || ''),
      name: backendReview.item_details.name || '',
      slug: backendReview.item_details.slug || '',
    },
    storeDetails: backendReview.store_details && {
      id: String(backendReview.store_details.id || ''),
      name: backendReview.store_details.name || '',
      slug: backendReview.store_details.slug || '',
    },
  };

  return review;
}

/**
 * Map multiple backend reviews to frontend Review type
 */
export function mapBackendReviewsToFrontend(backendReviews: any[]): ReviewWithMetrics[] {
  if (!Array.isArray(backendReviews)) {
    console.warn('mapBackendReviewsToFrontend received non-array:', backendReviews);
    return [];
  }
  return backendReviews.map(mapBackendReviewToFrontend);
}
