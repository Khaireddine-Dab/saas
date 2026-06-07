/**
 * Map Backend Transaction API responses to Frontend types
 * Handles format conversions and computed fields
 */

import { BackendTransactionListItem, BackendTransactionDetail } from '@/types/backend-transaction';

export interface FrontendTransaction {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  merchantId: number;
  merchantNumber: string;
  merchantName: string;
  driverName: string | null;
  dropLocation: string;
  amount: number;
  gateway: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  type: 'payment' | 'refund' | 'wallet_topup';
  date: Date;
  timeCreated: Date;
  timeAccepted: Date | null;
  collectionTime: Date | null;
  waitDuration: number | null;
  pickupTime: Date | null;
  deliveryDuration: number | null;
  timeDelivered: Date | null;
  km: number | null;
  fee: number;
  netAmount: number;
}

/**
 * Helper to safely parse dates
 */
const parseDate = (dateValue: any): Date => {
  if (!dateValue) return new Date();
  const parsed = new Date(dateValue);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

/**
 * Map a backend transaction list item to frontend format
 */
export function mapBackendTransactionToFrontend(
  backendTxn: BackendTransactionListItem | BackendTransactionDetail
): FrontendTransaction {
  const amount = parseFloat(backendTxn.amount);
  const fee = parseFloat(backendTxn.fee);
  const netAmount = parseFloat(backendTxn.net_amount);

  // Parse dates
  const timeCreated = parseDate(backendTxn.time_created);
  const timeAccepted = backendTxn.time_accepted ? parseDate(backendTxn.time_accepted) : null;
  
  // Handle detail fields that may not exist on list items
  const detail = backendTxn as Partial<BackendTransactionDetail>;
  const collectionTime = detail.collection_time ? parseDate(detail.collection_time) : null;
  const pickupTime = detail.pickup_time ? parseDate(detail.pickup_time) : null;
  const timeDelivered = detail.time_delivered ? parseDate(detail.time_delivered) : null;
  const waitDuration = detail.wait_duration_minutes ?? null;
  const deliveryDuration = detail.delivery_duration_minutes ?? null;
  const km = detail.km ?? null;

  return {
    id: backendTxn.id,
    orderNumber: `TXN-${backendTxn.id.split('-')[0].toUpperCase()}`,
    customerId: backendTxn.customer_id,
    customerName: `Customer ${backendTxn.customer_id.split('-')[0].substring(0, 8)}`,
    merchantId: backendTxn.merchant_id,
    merchantNumber: `MERCH-${String(backendTxn.merchant_id).padStart(4, '0')}`,
    merchantName: `Store ${backendTxn.merchant_id}`,
    driverName: backendTxn.driver_name || null,
    dropLocation: 'Delivery Zone', // Since not provided by backend
    amount,
    gateway: backendTxn.type === 'payment' ? 'api' : backendTxn.type, // Map backend type to gateway
    status: mapBackendStatus(backendTxn.status),
    type: mapBackendType(backendTxn.type),
    date: timeCreated, // Use creation time as the date
    timeCreated,
    timeAccepted,
    collectionTime,
    waitDuration,
    pickupTime,
    deliveryDuration,
    timeDelivered,
    km,
    fee,
    netAmount,
  };
}

/**
 * Map backend status to frontend status
 */
function mapBackendStatus(
  backendStatus: 'pending' | 'completed' | 'failed' | 'refunded'
): 'completed' | 'pending' | 'failed' | 'processing' {
  const statusMap: Record<string, 'completed' | 'pending' | 'failed' | 'processing'> = {
    pending: 'pending',
    completed: 'completed',
    failed: 'failed',
    refunded: 'failed', // Map refunded to failed for UI
  };
  return statusMap[backendStatus] || 'processing';
}

/**
 * Map backend transaction type to frontend type
 */
function mapBackendType(
  backendType: 'payment' | 'refund' | 'payout'
): 'payment' | 'refund' | 'wallet_topup' {
  const typeMap: Record<string, 'payment' | 'refund' | 'wallet_topup'> = {
    payment: 'payment',
    refund: 'refund',
    payout: 'wallet_topup', // Map payout to wallet_topup for UI
  };
  return typeMap[backendType] || 'payment';
}

/**
 * Map multiple backend transactions to frontend format
 */
export function mapBackendTransactionsToFrontend(
  backendTxns: (BackendTransactionListItem | BackendTransactionDetail)[]
): FrontendTransaction[] {
  return backendTxns.map(mapBackendTransactionToFrontend);
}
