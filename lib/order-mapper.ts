/**
 * Mappers pour transformer les données du backend vers les types frontend
 */

import type { Order } from '@/types/order';

/**
 * Helper to safely parse dates
 */
const parseDate = (dateValue: any): Date => {
  if (!dateValue) return new Date();
  const parsed = new Date(dateValue);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

/**
 * Transforme les données brutes du backend en type Order
 */
export function mapBackendOrderToFrontend(backendOrder: any): Order {
  return {
    id: String(backendOrder.id),
    orderId: backendOrder.order_number || 'N/A',
    userId: String(backendOrder.customer || ''),
    userName: backendOrder.customer_name || 'Unknown',
    userEmail: backendOrder.customer_email || '',
    businessId: String(backendOrder.store || ''),
    businessName: backendOrder.store_details?.name || 'Unknown Store',
    totalAmount: parseFloat(backendOrder.total_price) || 0,
    items: [
      {
        id: String(backendOrder.item || ''),
        productId: String(backendOrder.item || ''),
        productName: backendOrder.item_details?.name || 'Unknown Product',
        quantity: backendOrder.quantity || 1,
        price: parseFloat(backendOrder.unit_price) || 0,
        total: parseFloat(backendOrder.total_price) || 0,
      },
    ],
    status: mapBackendStatusToFrontend(backendOrder.status),
    paymentStatus: 'paid', // À adapter selon le backend
    paymentMethod: 'unknown', // À adapter selon le backend
    shippingAddress: {
      street: backendOrder.delivery_address || '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    billingAddress: {
      street: backendOrder.delivery_address || '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    createdAt: parseDate(backendOrder.created_at),
    updatedAt: parseDate(backendOrder.updated_at),
    timeline: [],
    notes: backendOrder.vendor_notes || backendOrder.customer_notes || '',
    requiresManualApproval: false,
  };
}

/**
 * Mappe les statuts du backend vers le frontend
 */
function mapBackendStatusToFrontend(
  backendStatus: string
): 'pending' | 'approved' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' {
  const statusMap: Record<string, any> = {
    PENDING: 'pending',
    VALIDATED: 'approved',
    COMPLETED: 'delivered',
    CANCELLED: 'cancelled',
  };

  return statusMap[backendStatus?.toUpperCase()] || 'pending';
}

/**
 * Transforme plusieurs commandes
 */
export function mapBackendOrdersToFrontend(backendOrders: any[]): Order[] {
  return backendOrders.map(mapBackendOrderToFrontend);
}
