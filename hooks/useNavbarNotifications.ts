'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { notificationsApi } from '@/lib/api';
import type { AppNotification } from '@/types/notification';

const POLL_INTERVAL_MS = 30_000;

export function useNavbarNotifications(userId?: string) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const data = await notificationsApi.list({ user_id: userId, limit: 20 });
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchNotifications();
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [userId, fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markRead = useCallback(async (id: string, link?: string | null) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      if (link) {
        router.push(link);
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, [router]);

  const markAllRead = useCallback(async () => {
    if (!userId) return;

    try {
      await notificationsApi.markAllRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }, [userId]);

  const goToAll = useCallback(() => {
    router.push('/dashboard/notifications');
  }, [router]);

  return {
    notifications,
    unreadCount,
    loading,
    markRead,
    markAllRead,
    goToAll,
    refresh: fetchNotifications,
  };
}
