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
  active: 'bg-green-500/20 text-green-400 border-green-500/40',
  inactive: 'bg-muted text-muted-foreground border-border',
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  approved: 'bg-green-500/20 text-green-400 border-green-500/40',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/40',
  suspended: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  visible: 'bg-green-500/20 text-green-400 border-green-500/40',
  hidden: 'bg-muted text-muted-foreground border-border',
  flagged: 'bg-red-500/20 text-red-400 border-red-500/40',
  banned: 'bg-red-500/30 text-red-300 border-red-500/50',
  investigating: 'bg-primary/20 text-primary border-primary/40',
  waiting_response: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  resolved: 'bg-green-500/20 text-green-400 border-green-500/40',
  escalated: 'bg-red-500/20 text-red-400 border-red-500/40',
};

export const RISK_LEVELS = ['low', 'medium', 'high', 'critical'] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: 'bg-green-500/20 text-green-400 border-green-500/40',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  critical: 'bg-red-500/20 text-red-400 border-red-500/40',
};
