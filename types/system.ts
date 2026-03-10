export type RolePermission = 'manage_users' | 'manage_orders' | 'manage_products' | 'manage_coupons' | 'manage_banners' | 'manage_fraud' | 'manage_settings' | 'manage_admins' | 'view_analytics' | 'view_reports';
export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'analyst' | 'support';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: RolePermission[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemStatus {
  apiStatus: 'healthy' | 'degraded' | 'down';
  databaseLatency: number;
  queueWorkerStatus: 'healthy' | 'down';
  failedJobsCount: number;
  uptime: number;
}

export interface PlatformHealth {
  timestamp: Date;
  status: SystemStatus;
  metrics: HealthMetrics;
}

export interface HealthMetrics {
  requestsPerSecond: number;
  errorRate: number;
  avgResponseTime: number;
  activeConnections: number;
}

export interface RevenueIntelligence {
  totalRevenue: number;
  avgOrderValue: number;
  topCategories: CategoryRevenue[];
  highValueCustomers: Customer[];
  forecast30Day: number;
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
  percentage: number;
  orders: number;
}

export interface Customer {
  id: string;
  name: string;
  totalSpend: number;
  orderCount: number;
  avgOrderValue: number;
}

export interface PaymentGatewaySetting {
  provider: string;
  apiKey?: string;
  apiSecret?: string;
  isActive: boolean;
  commission: number;
}

export interface ThemeBrandingSetting {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo?: string;
  favicon?: string;
  platformName: string;
  supportEmail: string;
}
