import {
  Bell, Mail, MessageSquare, ShoppingCart, UserCheck, Star,
  Shield, AlertCircle, Building2, Tag, Megaphone, Send,
  type LucideIcon,
} from 'lucide-react';
import type { AppNotification } from '@/types/notification';

export interface NotificationVisual {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

const TYPE_VISUALS: Record<string, NotificationVisual> = {
  push: { icon: Bell, iconColor: 'text-purple-400', iconBg: 'bg-purple-500/10' },
  email: { icon: Mail, iconColor: 'text-blue-400', iconBg: 'bg-blue-500/10' },
  sms: { icon: MessageSquare, iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/10' },
  order: { icon: ShoppingCart, iconColor: 'text-amber-400', iconBg: 'bg-amber-500/10' },
  user: { icon: UserCheck, iconColor: 'text-green-400', iconBg: 'bg-green-500/10' },
  review: { icon: Star, iconColor: 'text-orange-400', iconBg: 'bg-orange-500/10' },
  fraud: { icon: Shield, iconColor: 'text-red-400', iconBg: 'bg-red-500/10' },
  support: { icon: AlertCircle, iconColor: 'text-red-400', iconBg: 'bg-red-500/10' },
  store: { icon: Building2, iconColor: 'text-blue-500', iconBg: 'bg-blue-500/10' },
  promotion: { icon: Tag, iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/10' },
  announcement: { icon: Megaphone, iconColor: 'text-amber-400', iconBg: 'bg-amber-500/10' },
  system: { icon: Bell, iconColor: 'text-purple-400', iconBg: 'bg-purple-500/10' },
};

const LINKED_TYPE_VISUALS: Record<string, NotificationVisual> = {
  item: { icon: Tag, iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/10' },
  reel: { icon: Send, iconColor: 'text-purple-400', iconBg: 'bg-purple-500/10' },
  story: { icon: Send, iconColor: 'text-pink-400', iconBg: 'bg-pink-500/10' },
  comment: { icon: MessageSquare, iconColor: 'text-amber-400', iconBg: 'bg-amber-500/10' },
  promotion: { icon: Tag, iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/10' },
};

export function getNotificationVisual(notification: AppNotification): NotificationVisual {
  const linkedType = notification.metadata?.linked_type as string | undefined;
  if (linkedType && LINKED_TYPE_VISUALS[linkedType]) {
    return LINKED_TYPE_VISUALS[linkedType];
  }

  const type = notification.type?.toLowerCase() ?? '';
  if (TYPE_VISUALS[type]) {
    return TYPE_VISUALS[type];
  }

  const title = notification.title.toLowerCase();
  if (title.includes('order')) return TYPE_VISUALS.order;
  if (title.includes('user') || title.includes('utilisateur')) return TYPE_VISUALS.user;
  if (title.includes('review') || title.includes('avis')) return TYPE_VISUALS.review;
  if (title.includes('fraud') || title.includes('fraude')) return TYPE_VISUALS.fraud;
  if (title.includes('support') || title.includes('ticket')) return TYPE_VISUALS.support;
  if (title.includes('business') || title.includes('store') || title.includes('merchant')) return TYPE_VISUALS.store;

  return { icon: Bell, iconColor: 'text-purple-400', iconBg: 'bg-purple-500/10' };
}

export function formatNotificationTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}
