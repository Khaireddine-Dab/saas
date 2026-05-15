import type { Item } from '@/types/item';

/**
 * Transforme les données brutes du backend en type Item
 */
export function mapBackendItemToFrontend(backendItem: any): Item {
  return {
    id: String(backendItem.id),
    itemType: backendItem.item_type || 'PRODUCT',
    itemTypeDisplay: backendItem.item_type_display || 'Produit',
    storeId: String(backendItem.store || ''),
    storeName: backendItem.store_details?.name || 'Inconnu',
    name: backendItem.name || 'Sans nom',
    slug: backendItem.slug || '',
    description: backendItem.description || null,
    price: parseFloat(backendItem.price) || 0,
    priceUnit: backendItem.price_unit || 'unit',
    
    // Product-specific
    stockQuantity: backendItem.stock_quantity || null,
    orderCount: backendItem.order_count || 0,
    
    // Service-specific
    durationMinutes: backendItem.duration_minutes || null,
    isBookable: backendItem.is_bookable || false,
    availableDays: backendItem.available_days || null,
    bookingCount: backendItem.booking_count || 0,
    
    // Common
    mainImage: backendItem.main_image || '',
    image2: backendItem.image_2 || null,
    image3: backendItem.image_3 || null,
    status: backendItem.status || 'AVAILABLE',
    statusDisplay: backendItem.status_display || 'Disponible',
    
    // Analytics
    viewCount: backendItem.view_count || 0,
    ratingAverage: parseFloat(backendItem.rating_average) || 0,
    totalReviews: backendItem.total_reviews || 0,
    
    createdAt: new Date(backendItem.created_at),
    updatedAt: new Date(backendItem.updated_at),
  };
}

export function mapBackendItemsToFrontend(backendItems: any[]): Item[] {
  return backendItems.map(mapBackendItemToFrontend);
}
