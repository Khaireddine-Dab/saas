import { Business } from '@/types/business';
import { Product } from '@/types/product';
import { Review } from '@/types/review';
import { Report } from '@/types/report';

// Navigation items
export const DASHBOARD_NAVIGATION = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'grid',
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: 'users',
  },
  {
    title: 'Businesses',
    href: '/dashboard/businesses',
    icon: 'briefcase',
  },
  {
    title: 'Products',
    href: '/dashboard/products',
    icon: 'package',
  },
  {
    title: 'Reviews',
    href: '/dashboard/reviews',
    icon: 'star',
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: 'alert-circle',
  },
  {
    title: 'Map',
    href: '/dashboard/map',
    icon: 'map',
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: 'bar-chart',
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: 'settings',
  },
];

// Status options
export const USER_STATUSES = ['active', 'inactive', 'suspended', 'banned'] as const;
export const BUSINESS_STATUSES = ['pending', 'approved', 'rejected', 'suspended'] as const;
export const PRODUCT_STATUSES = ['visible', 'hidden', 'flagged', 'banned'] as const;
export const REPORT_STATUSES = ['pending', 'investigating', 'waiting_response', 'resolved', 'escalated'] as const;
export const REPORT_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
export const REVIEW_STATUSES = ['visible', 'hidden', 'flagged'] as const;

// Roles and permissions
export const USER_ROLES = ['admin', 'moderator', 'analyst'] as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['all'],
  moderator: ['view_all', 'moderate_content', 'manage_reports', 'ban_users'],
  analyst: ['view_analytics', 'generate_reports', 'export_data'],
};

// Category options
export const BUSINESS_CATEGORIES = [
  'Restaurants & Cafes',
  'Retail Shops',
  'Services',
  'Healthcare',
  'Education',
  'Technology',
  'Entertainment',
  'Travel & Tourism',
  'Real Estate',
  'Other',
] as const;

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food & Beverages',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Toys & Games',
  'Beauty & Personal Care',
  'Other',
] as const;

// Report reasons
export const REPORT_REASONS = {
  product: ['spam', 'inappropriate', 'fake', 'misleading', 'other'],
  business: ['fraudulent', 'unlicensed', 'inappropriate', 'duplicate', 'other'],
  user: ['suspicious_activity', 'spam', 'harassment', 'fake_account', 'other'],
  review: ['spam', 'fake', 'inappropriate', 'duplicate', 'other'],
};

// Mock feature flags
export const FEATURES = {
  LOCATION_VERIFICATION: true,
  ADVANCED_ANALYTICS: true,
  AUTOMATED_MODERATION: false,
  DUPLICATE_DETECTION: true,
  BUSINESS_MERGE: true,
  MANUAL_SEARCH_BOOST: true,
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

// Time periods for analytics
export const TIME_PERIODS = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Last year', value: '1y' },
  { label: 'All time', value: 'all' },
];

// Risk score thresholds
export const RISK_THRESHOLDS = {
  LOW: 20,
  MEDIUM: 50,
  HIGH: 75,
  CRITICAL: 90,
};

// Spam detection thresholds
export const SPAM_THRESHOLDS = {
  LOW: 30,
  MEDIUM: 60,
  HIGH: 80,
};
