import { ReportStatus, ReportPriority } from './common';

export interface Report {
  id: string;
  type: 'product' | 'business' | 'user' | 'review';
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  targetId: string;
  targetName: string;
  targetType: 'product' | 'business' | 'user' | 'review';
  reason: string;
  description: string;
  evidence?: string[];
  status: ReportStatus;
  priority: ReportPriority;
  assignedAdminId?: string;
  assignedAdminName?: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  investigationStartedAt?: Date;
}

export interface ReportComment {
  id: string;
  reportId: string;
  adminId: string;
  adminName: string;
  content: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportTimeline {
  id: string;
  reportId: string;
  action: string;
  performer: string;
  details: string;
  timestamp: Date;
}

export interface DisputeBoard {
  totalReports: number;
  pendingCount: number;
  investigatingCount: number;
  waitingResponseCount: number;
  resolvedCount: number;
  escalatedCount: number;
  averageResolutionTime: number;
  byPriority: Record<ReportPriority, number>;
  byType: Record<string, number>;
}
