import React from 'react';
import { CheckCircle2, AlertCircle, Clock, User, Package, MessageSquare } from 'lucide-react';
import { formatTimeAgo } from '@/lib/helpers';

interface ActivityItem {
  id: string;
  type: 'business_approved' | 'product_flagged' | 'review_reported' | 'user_joined' | 'report_created';
  title: string;
  description: string;
  timestamp: Date;
  icon?: React.ReactNode;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
  title?: string;
}

const defaultActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'business_approved',
    title: 'Business Approved',
    description: 'Tech Gadgets Store has been verified and approved',
    timestamp: new Date(Date.now() - 2 * 60000),
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  },
  {
    id: '2',
    type: 'product_flagged',
    title: 'Product Flagged',
    description: 'Wireless Earbuds Pro flagged for review quality issues',
    timestamp: new Date(Date.now() - 15 * 60000),
    icon: <AlertCircle className="w-4 h-4 text-destructive" />,
  },
  {
    id: '3',
    type: 'review_reported',
    title: 'Review Reported',
    description: 'Review on Shawarma Plate reported as spam',
    timestamp: new Date(Date.now() - 45 * 60000),
    icon: <MessageSquare className="w-4 h-4 text-yellow-500" />,
  },
  {
    id: '4',
    type: 'user_joined',
    title: 'New User',
    description: 'New user Mohammed Al-Mansoori joined the platform',
    timestamp: new Date(Date.now() - 2 * 3600000),
    icon: <User className="w-4 h-4 text-primary" />,
  },
  {
    id: '5',
    type: 'report_created',
    title: 'Report Submitted',
    description: 'New dispute report filed against Tech Gadgets Store',
    timestamp: new Date(Date.now() - 3 * 3600000),
    icon: <Clock className="w-4 h-4 text-orange-500" />,
  },
];

export function RecentActivity({ activities = defaultActivities, title = 'Recent Activity' }: RecentActivityProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 pb-4 last:pb-0 border-b border-border last:border-0">
            <div className="flex-shrink-0 flex items-start pt-1">
              {activity.icon || <Clock className="w-4 h-4 text-muted-foreground" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                </div>
                <span className="flex-shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm font-medium text-primary hover:underline">
        View all activities →
      </button>
    </div>
  );
}
