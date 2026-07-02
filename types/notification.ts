export interface AppNotification {
  id: string;
  user: string;
  title: string;
  description: string | null;
  type: string;
  link: string | null;
  is_read: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
}
