/**
 * Backend Transaction API Response Types
 * Matches the Django transactions app models
 */

export interface BackendTransactionListItem {
  id: string; // UUID
  type: 'payment' | 'refund' | 'payout';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: string; // Decimal as string
  fee: string; // Decimal as string
  net_amount: string; // Computed: amount - fee
  customer_id: string; // UUID
  merchant_id: number; // BigInt
  booking_id: number | null;
  driver_name: string | null;
  time_created: string; // ISO datetime
  time_accepted: string | null; // ISO datetime
  is_recent: boolean; // Computed: created within 30 days
}

export interface BackendTransactionDetail extends BackendTransactionListItem {
  time_accepted: string | null; // ISO datetime
  collection_time: string | null; // ISO datetime
  pickup_time: string | null; // ISO datetime
  time_delivered: string | null; // ISO datetime
  wait_duration_minutes: number | null;
  delivery_duration_minutes: number | null;
  duration_total_minutes: number; // Computed: wait + delivery
  km: number | null;
}

export interface BackendTransactionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BackendTransactionListItem[];
}

export interface BackendTransactionStats {
  total_amount: string;
  total_fee: string;
  total_transactions: number;
  successful_count: number;
  failed_count: number;
  pending_count: number;
  success_rate: number;
  average_amount: string;
  average_fee: string;
  status_breakdown: Record<string, number>;
  type_breakdown: Record<string, number>;
}

export interface BackendTransactionCreate {
  type: 'payment' | 'refund' | 'payout';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: string;
  fee?: string;
  customer_id: string;
  merchant_id: number;
  booking_id?: number | null;
  driver_name?: string | null;
  time_accepted?: string;
  collection_time?: string;
  pickup_time?: string;
  time_delivered?: string;
  wait_duration_minutes?: number | null;
  delivery_duration_minutes?: number | null;
  km?: number | null;
}

export interface BackendTransactionUpdate extends Partial<BackendTransactionCreate> {}
