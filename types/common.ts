// Common types and enums used across the dashboard

export type UserRole = 'admin' | 'moderator' | 'analyst';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'banned';
export type BusinessStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type ProductStatus = 'visible' | 'hidden' | 'flagged' | 'banned';
export type ReportStatus = 'pending' | 'investigating' | 'waiting_response' | 'resolved' | 'escalated';
export type ReportPriority = 'low' | 'medium' | 'high' | 'critical';
export type ReviewStatus = 'visible' | 'hidden' | 'flagged';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  success: boolean;
}

export const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-200',
  inactive: 'bg-gray-50 text-gray-700 border-gray-200',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  suspended: 'bg-orange-50 text-orange-700 border-orange-200',
  visible: 'bg-green-50 text-green-700 border-green-200',
  hidden: 'bg-gray-50 text-gray-700 border-gray-200',
  flagged: 'bg-red-50 text-red-700 border-red-200',
  banned: 'bg-red-50 text-red-700 border-red-200',
  investigating: 'bg-blue-50 text-blue-700 border-blue-200',
  waiting_response: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  resolved: 'bg-green-50 text-green-700 border-green-200',
  escalated: 'bg-red-50 text-red-700 border-red-200',
};

export const RISK_LEVELS = ['low', 'medium', 'high', 'critical'] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: 'bg-green-50 text-green-700 border-green-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
};
