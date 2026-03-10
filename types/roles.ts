'use strict';

export type Permission =
  | 'view_dashboard'
  | 'view_users'
  | 'edit_users'
  | 'delete_users'
  | 'view_orders'
  | 'edit_orders'
  | 'approve_orders'
  | 'view_merchants'
  | 'edit_merchants'
  | 'view_products'
  | 'edit_products'
  | 'delete_products'
  | 'view_reviews'
  | 'moderate_reviews'
  | 'view_analytics'
  | 'view_reports'
  | 'create_reports'
  | 'view_drivers'
  | 'manage_drivers'
  | 'view_commissions'
  | 'edit_commissions'
  | 'view_payouts'
  | 'approve_payouts'
  | 'manage_coupons'
  | 'manage_banners'
  | 'manage_notifications'
  | 'view_settings'
  | 'edit_settings'
  | 'manage_admins'
  | 'view_fraud_alerts'
  | 'investigate_fraud';

export type RoleType = 'super-admin' | 'admin' | 'moderator' | 'analyst' | 'support';

export interface Role {
  id: string;
  name: RoleType;
  displayName: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  permissions: Permission[];
}

export const DEFAULT_PERMISSIONS: Record<RoleType, Permission[]> = {
  'super-admin': [
    'view_dashboard',
    'view_users',
    'edit_users',
    'delete_users',
    'view_orders',
    'edit_orders',
    'approve_orders',
    'view_merchants',
    'edit_merchants',
    'view_products',
    'edit_products',
    'delete_products',
    'view_reviews',
    'moderate_reviews',
    'view_analytics',
    'view_reports',
    'create_reports',
    'view_drivers',
    'manage_drivers',
    'view_commissions',
    'edit_commissions',
    'view_payouts',
    'approve_payouts',
    'manage_coupons',
    'manage_banners',
    'manage_notifications',
    'view_settings',
    'edit_settings',
    'manage_admins',
    'view_fraud_alerts',
    'investigate_fraud',
  ],
  admin: [
    'view_dashboard',
    'view_users',
    'edit_users',
    'view_orders',
    'edit_orders',
    'approve_orders',
    'view_merchants',
    'edit_merchants',
    'view_products',
    'view_reviews',
    'moderate_reviews',
    'view_analytics',
    'view_reports',
    'view_drivers',
    'view_commissions',
    'view_payouts',
    'manage_coupons',
    'manage_banners',
    'manage_notifications',
    'view_settings',
    'view_fraud_alerts',
  ],
  moderator: [
    'view_dashboard',
    'view_users',
    'view_orders',
    'view_merchants',
    'view_products',
    'view_reviews',
    'moderate_reviews',
    'view_reports',
    'view_drivers',
    'view_fraud_alerts',
    'investigate_fraud',
  ],
  analyst: [
    'view_dashboard',
    'view_users',
    'view_orders',
    'view_merchants',
    'view_products',
    'view_reviews',
    'view_analytics',
    'view_reports',
    'view_drivers',
  ],
  support: [
    'view_users',
    'view_orders',
    'view_merchants',
    'view_products',
    'view_reviews',
  ],
};
