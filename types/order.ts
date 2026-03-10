export type OrderStatus = 'pending' | 'approved' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus;
  timestamp: Date;
  actor: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  businessId: string;
  businessName: string;
  totalAmount: number;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
  timeline: OrderTimelineEvent[];
  notes: string;
  requiresManualApproval: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderMetrics {
  totalOrders: number;
  pendingOrders: number;
  avgOrderValue: number;
  totalRevenue: number;
  conversionRate: number;
}

export interface OrderFilter {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  businessId?: string;
  userId?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}
