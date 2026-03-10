export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertType = 'suspicious_activity' | 'fake_review' | 'unusual_spike' | 'suspicious_seller' | 'payment_fraud' | 'bot_activity';
export type AlertStatus = 'open' | 'investigating' | 'resolved' | 'false_positive';

export interface FraudAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  description: string;
  entityType: 'user' | 'order' | 'business' | 'product' | 'review';
  entityId: string;
  entityName: string;
  riskScore: number;
  flags: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  assignedTo?: string;
  notes: string;
}

export interface FraudMetrics {
  totalAlerts: number;
  openAlerts: number;
  criticalAlerts: number;
  avgResolutionTime: number;
  resolvedAlerts: number;
  falsePositiveRate: number;
}

export interface FraudFilter {
  type?: AlertType;
  severity?: AlertSeverity;
  status?: AlertStatus;
  entityType?: string;
}

export interface SuspiciousActivity {
  userId: string;
  activityType: string;
  riskScore: number;
  details: Record<string, any>;
}

export interface ReviewFlagData {
  reviewId: string;
  sentiment: number;
  spamProbability: number;
  flags: string[];
}
