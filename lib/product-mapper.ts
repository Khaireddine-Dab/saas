/**
 * Mappers pour transformer les données du backend produits vers les types frontend
 */

import type { Product } from '@/types/product';

/**
 * Transforme les données brutes du backend en type Product
 */
export function mapBackendProductToFrontend(backendProduct: any): Product {
  // Helper to safely parse dates
  const parseDate = (dateValue: any): Date => {
    if (!dateValue) return new Date();
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  return {
    id: String(backendProduct.id),
    businessId: String(backendProduct.store || ''),
    businessName: backendProduct.store_details?.name || 'Inconnu',
    name: backendProduct.name || 'Sans nom',
    description: backendProduct.description || '',
    category: backendProduct.category || 'Général',
    price: parseFloat(backendProduct.price) || 0,
    currency: backendProduct.currency || 'TND',
    images: Array.isArray(backendProduct.images) 
      ? backendProduct.images 
      : (backendProduct.image ? [backendProduct.image] : []),
    status: mapBackendProductStatus(backendProduct.status),
    totalReports: backendProduct.total_reports || 0,
    flaggedCount: backendProduct.flagged_count || 0,
    averageRating: parseFloat(backendProduct.average_rating) || 0,
    reviewCount: backendProduct.review_count || 0,
    visibility: mapBackendVisibility(backendProduct.visibility),
    featured: backendProduct.featured || false,
    featuredUntil: backendProduct.featured_until
      ? parseDate(backendProduct.featured_until)
      : undefined,
    createdAt: parseDate(backendProduct.created_at),
    updatedAt: parseDate(backendProduct.updated_at),
    lastModeratedAt: backendProduct.last_moderated_at
      ? parseDate(backendProduct.last_moderated_at)
      : undefined,
  };
}

/**
 * Mappe le statut du produit du backend vers le frontend
 */
function mapBackendProductStatus(
  status: string
): 'visible' | 'hidden' | 'flagged' | 'banned' {
  const statusMap: Record<string, any> = {
    VISIBLE: 'visible',
    PUBLISHED: 'visible',
    ACTIVE: 'visible',
    HIDDEN: 'hidden',
    FLAGGED: 'flagged',
    BANNED: 'banned',
    SUSPENDED: 'flagged',
    INACTIVE: 'hidden',
  };

  return statusMap[status?.toUpperCase()] || 'visible';
}

/**
 * Mappe la visibilité du produit
 */
function mapBackendVisibility(visibility: string): 'public' | 'private' | 'hidden' {
  const visibilityMap: Record<string, any> = {
    PUBLIC: 'public',
    PRIVATE: 'private',
    HIDDEN: 'hidden',
  };

  return visibilityMap[visibility?.toUpperCase()] || 'public';
}

/**
 * Transforme plusieurs produits
 */
export function mapBackendProductsToFrontend(backendProducts: any[]): Product[] {
  return backendProducts.map(mapBackendProductToFrontend);
}
