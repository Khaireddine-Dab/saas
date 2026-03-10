import type { Order } from './order';

export interface OrderRefund {
  id: string;
  orderId: string;
  amount: number;
  reason: 'customer_request' | 'damaged' | 'wrong_item' | 'not_received' | 'other';
  status: 'pending' | 'approved' | 'processed' | 'rejected';
  requestedAt: Date;
  approvedAt?: Date;
  processedAt?: Date;
  notes?: string;
}

export interface OrderInvoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  issuedAt: Date;
  dueDate?: Date;
  tax: number;
  taxRate: number;
  subtotal: number;
  total: number;
  pdfUrl?: string;
}

export interface OrderNote {
  id: string;
  orderId: string;
  author: string;
  content: string;
  isInternal: boolean;
  createdAt: Date;
}

export interface BulkOrderAction {
  action: 'status_update' | 'assign_driver' | 'send_notification' | 'process_refund';
  selectedOrderIds: string[];
  details?: Record<string, any>;
}

export interface OrderAnalytics {
  totalOrders: number;
  pendingOrders: number;
  processedOrders: number;
  cancelledOrders: number;
  avgOrderValue: number;
  totalRevenue: number;
  avgFulfillmentTime: number; // in hours
  refundRate: number; // percentage
  statusDistribution: Record<string, number>;
  peakOrderHour: number;
  topPaymentMethod: string;
  repeatCustomers: number;
}

export interface OrderFilter {
  status?: string[];
  paymentStatus?: string[];
  paymentMethod?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  customerId?: string;
  merchantId?: string;
  searchQuery?: string;
}
