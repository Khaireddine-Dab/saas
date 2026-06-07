'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Bell,
  Plus,
  Search,
  Trash2,
  Check,
  Mail,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  Inbox,
  ExternalLink,
  CheckCheck,
  Link2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import type { User } from '@/types/user';

interface Notification {
  id: string;
  user: string;
  user_details?: User | null;
  title: string;
  description: string | null;
  type: string;
  link: string | null;
  is_read: boolean;
  metadata: Record<string, any> | null;
  created_at: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // 'read', 'unread', ''

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [targetUserId, setTargetUserId] = useState('');
  const [notifType, setNotifType] = useState('push');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifDescription, setNotifDescription] = useState('');
  const [notifLink, setNotifLink] = useState('');
  const [notifMetadata, setNotifMetadata] = useState('{}');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resource lists to link
  const [items, setItems] = useState<any[]>([]);
  const [reels, setReels] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [linkedResourceType, setLinkedResourceType] = useState('');
  const [linkedResourceId, setLinkedResourceId] = useState('');

  // Delete State
  const [notifToDelete, setNotifToDelete] = useState<Notification | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/notifications/`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load notifications: ${response.statusText}`);
      }
      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching notifications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch Users for Recipient Selection
  const fetchUsers = useCallback(async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/users/list/`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, [fetchNotifications, fetchUsers]);

  // Load resources for selected user to link
  const loadLinkedResources = async (userId: string) => {
    if (!userId) return;
    try {
      setLoadingResources(true);
      const token = getToken();
      const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // 1. Fetch all stores to find ALL stores owned by this user
      const storesRes = await fetch(`${API_BASE}/api/stores/`, { headers });
      let storeIds: number[] = [];
      if (storesRes.ok) {
        const stores = await storesRes.json();
        // Filter ALL stores owned by this user (not just the first one)
        const userStores = stores.filter((s: any) =>
          String(s.owner_id) === String(userId)
        );
        storeIds = userStores.map((s: any) => s.id);
      }

      // 2. Fetch resources from ALL the user's stores in parallel
      const safeJson = async (res: Response) => {
        if (!res.ok) return [];
        try {
          const d = await res.json();
          return Array.isArray(d) ? d : d.results || [];
        } catch {
          return [];
        }
      };

      if (storeIds.length > 0) {
        // Owner with stores — aggregate from each store
        const allResults = await Promise.all(
          storeIds.map(async (storeId) => {
            const [itemsRes, reelsRes, storiesRes, promosRes] = await Promise.all([
              fetch(`${API_BASE}/api/items/store/${storeId}/`, { headers }).catch(() => new Response('[]', { status: 200 })),
              fetch(`${API_BASE}/api/reels/?store_id=${storeId}`, { headers }).catch(() => new Response('[]', { status: 200 })),
              fetch(`${API_BASE}/api/stories/?store_id=${storeId}`, { headers }).catch(() => new Response('[]', { status: 200 })),
              fetch(`${API_BASE}/api/promotions/?store_id=${storeId}`, { headers }).catch(() => new Response('[]', { status: 200 })),
            ]);
            return {
              items: await safeJson(itemsRes),
              reels: await safeJson(reelsRes),
              stories: await safeJson(storiesRes),
              promotions: await safeJson(promosRes),
            };
          })
        );

        // Merge and deduplicate by id
        const mergeById = (arrays: any[][]) => {
          const map = new Map<string | number, any>();
          arrays.flat().forEach(item => map.set(item.id, item));
          return Array.from(map.values());
        };

        setItems(mergeById(allResults.map(r => r.items)));
        setReels(mergeById(allResults.map(r => r.reels)));
        setStories(mergeById(allResults.map(r => r.stories)));
        setPromotions(mergeById(allResults.map(r => r.promotions)));
      }

      // 3. Always fetch comments (not store-specific)
      const commentsRes = await fetch(`${API_BASE}/api/reel-comments/`, { headers }).catch(() => null);
      if (commentsRes) setComments(await safeJson(commentsRes));

    } catch (err) {
      console.error('Failed to load linked resources:', err);
    } finally {
      setLoadingResources(false);
    }
  };


  // Trigger resource load when target user changes
  useEffect(() => {
    if (targetUserId) {
      setItems([]);
      setReels([]);
      setStories([]);
      setComments([]);
      setPromotions([]);
      setLinkedResourceType('');
      setLinkedResourceId('');
      loadLinkedResources(targetUserId);
    }
  }, [targetUserId]);

  // Handle selected resource details binding
  const handleResourceChange = (type: string, id: string) => {
    setLinkedResourceId(id);
    if (!id) {
      setNotifLink('');
      setNotifMetadata('{}');
      return;
    }

    let linkVal = '';
    let metaVal: Record<string, any> = {
      linked_type: type,
      linked_id: id
    };

    if (type === 'item') {
      const item = items.find(i => i.id.toString() === id);
      if (item) {
        linkVal = `/dashboard/items?id=${item.id}`;
        metaVal.name = item.name;
        metaVal.price = item.price;
        if (!notifTitle) setNotifTitle(`Update on product: ${item.name}`);
      }
    } else if (type === 'reel') {
      const reel = reels.find(r => r.id.toString() === id);
      if (reel) {
        linkVal = `/dashboard/banners?tab=reels&id=${reel.id}`;
        metaVal.title = reel.title;
        if (!notifTitle) setNotifTitle(`New activity on Reel: ${reel.title}`);
      }
    } else if (type === 'story') {
      const story = stories.find(s => s.id.toString() === id);
      if (story) {
        linkVal = `/dashboard/banners?tab=stories&id=${story.id}`;
        metaVal.caption = story.caption || `Story #${story.id}`;
        if (!notifTitle) setNotifTitle(`Story Update`);
      }
    } else if (type === 'promotion') {
      const promo = promotions.find(p => p.id.toString() === id);
      if (promo) {
        linkVal = `/dashboard/promotions?id=${promo.id}`;
        metaVal.title = promo.title;
        metaVal.discount_percent = promo.discount_percent;
        if (!notifTitle) setNotifTitle(`New Promotion: ${promo.title}`);
      }
    } else if (type === 'comment') {
      const comment = comments.find(c => c.id.toString() === id);
      if (comment) {
        linkVal = `/dashboard/banners?comment_id=${comment.id}`;
        metaVal.content = comment.content;
        if (!notifTitle) setNotifTitle(`New comment reply`);
      }
    }

    setNotifLink(linkVal);
    setNotifMetadata(JSON.stringify(metaVal, null, 2));
  };

  // Handle Mark as Read
  const handleMarkAsRead = async (id: string) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/notifications/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ is_read: true }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
        );
      } else {
        console.error('Failed to mark read');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Mark All as Read
  const handleMarkAllRead = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/notifications/mark-all-read/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      } else {
        console.error('Failed to mark all read');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Create Notification
  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId || !notifTitle) {
      alert('Please fill in the required fields (Recipient and Title).');
      return;
    }

    let parsedMetadata = {};
    try {
      if (notifMetadata.trim()) {
        parsedMetadata = JSON.parse(notifMetadata);
      }
    } catch (err) {
      alert('Metadata must be a valid JSON object.');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/notifications/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          user: targetUserId,
          title: notifTitle,
          description: notifDescription || null,
          type: notifType,
          link: notifLink || null,
          metadata: parsedMetadata,
        }),
      });

      if (response.ok) {
        setShowCreateModal(false);
        // Reset Form
        setTargetUserId('');
        setNotifTitle('');
        setNotifDescription('');
        setNotifLink('');
        setNotifMetadata('{}');
        setLinkedResourceType('');
        setLinkedResourceId('');
        fetchNotifications();
      } else {
        const errorData = await response.json();
        alert(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to send notification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Notification
  const handleDeleteNotification = async () => {
    if (!notifToDelete) return;
    try {
      setIsDeleting(true);
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/notifications/${notifToDelete.id}/`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notifToDelete.id));
        setNotifToDelete(null);
      } else {
        alert('Failed to delete notification');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter users by search
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery) return users;
    const lower = userSearchQuery.toLowerCase();
    return users.filter(
      u =>
        u.email.toLowerCase().includes(lower) ||
        (u.full_name && u.full_name.toLowerCase().includes(lower))
    );
  }, [users, userSearchQuery]);

  // Filtered Notifications list
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.description && n.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (n.user_details?.email && n.user_details.email.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = !typeFilter || n.type === typeFilter;
      const matchesStatus =
        !statusFilter ||
        (statusFilter === 'read' ? n.is_read : !n.is_read);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [notifications, searchQuery, typeFilter, statusFilter]);

  // Statistics
  const totalCount = notifications.length;
  const readCount = notifications.filter(n => n.is_read).length;
  const unreadCount = totalCount - readCount;
  const readRate = totalCount > 0 ? Math.round((readCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
            Notification Hub
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Create, dispatch, and monitor platform alerts across channels
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchNotifications}
            className="h-10 px-4 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="h-10 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all active:scale-95"
          >
            <CheckCheck className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
            Mark all read
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="h-10 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/10 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Notification
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border border-slate-100 dark:border-slate-800/60 shadow-sm bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-950 dark:to-slate-900/30 transition-all duration-300 hover:shadow-md">
          <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Total Dispatch</div>
          <div className="text-3xl font-extrabold mt-2 tracking-tight text-slate-800 dark:text-slate-100">
            {isLoading ? '...' : totalCount}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Notifications registered</div>
        </Card>
        <Card className="p-5 border border-emerald-100/40 dark:border-emerald-950/20 shadow-sm bg-gradient-to-br from-white to-emerald-50/10 dark:from-slate-950 dark:to-emerald-950/5 transition-all duration-300 hover:shadow-md">
          <div className="text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">Read Alerts</div>
          <div className="text-3xl font-extrabold mt-2 tracking-tight text-slate-800 dark:text-slate-100">
            {isLoading ? '...' : readCount}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Confirmed views</div>
        </Card>
        <Card className="p-5 border border-orange-100/40 dark:border-orange-950/20 shadow-sm bg-gradient-to-br from-white to-orange-50/10 dark:from-slate-950 dark:to-orange-950/5 transition-all duration-300 hover:shadow-md">
          <div className="text-xs font-semibold tracking-wider text-orange-600 dark:text-orange-400 uppercase">Unread alerts</div>
          <div className="text-3xl font-extrabold mt-2 tracking-tight text-slate-800 dark:text-slate-100">
            {isLoading ? '...' : unreadCount}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Pending interaction</div>
        </Card>
        <Card className="p-5 border border-indigo-100/40 dark:border-indigo-950/20 shadow-sm bg-gradient-to-br from-white to-indigo-50/10 dark:from-slate-950 dark:to-indigo-950/5 transition-all duration-300 hover:shadow-md">
          <div className="text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">Read Rate</div>
          <div className="text-3xl font-extrabold mt-2 tracking-tight text-slate-800 dark:text-slate-100">
            {isLoading ? '...' : `${readRate}%`}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Read / Dispatch ratio</div>
        </Card>
      </div>

      {/* Filter Card */}
      <Card className="p-4 border border-slate-100 dark:border-slate-800/60 shadow-sm bg-white dark:bg-slate-950">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications by title, content, or user..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-slate-200 dark:border-slate-800 bg-slate-50/30 focus-visible:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2.5 flex-wrap sm:flex-nowrap">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="h-10 px-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-foreground text-sm font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all cursor-pointer min-w-[130px]"
            >
              <option value="">All Channels</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push Notification</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="h-10 px-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-foreground text-sm font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all cursor-pointer min-w-[130px]"
            >
              <option value="">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="p-4 border-red-200/60 bg-red-50/50 dark:bg-red-950/10 dark:border-red-950/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-red-800 dark:text-red-400">Database Connection Failed</h4>
            <p className="text-xs text-red-700 dark:text-red-500 mt-1">{error}</p>
          </div>
        </Card>
      )}

      {/* Notification Table */}
      <Card className="overflow-hidden border border-slate-100 dark:border-slate-800/60 shadow-sm bg-white dark:bg-slate-950">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm text-muted-foreground animate-pulse">Loading notification records...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800/50 text-muted-foreground mb-4">
                <Inbox className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">No Notifications Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-1">
                There are no notifications matching the filters or query you entered.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50/60 dark:bg-slate-900/60 border-b border-border font-semibold text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Channel</th>
                  <th className="px-6 py-4 text-left font-semibold">Alert Info</th>
                  <th className="px-6 py-4 text-left font-semibold">Recipient</th>
                  <th className="px-6 py-4 text-left font-semibold">Dispatch Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-center font-semibold w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredNotifications.map(notif => {
                  const hasDetails = !!notif.user_details;
                  return (
                    <tr
                      key={notif.id}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors ${
                        !notif.is_read ? 'bg-slate-50/10 dark:bg-slate-900/5 font-medium' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-lg border ${
                            notif.type === 'email'
                              ? 'bg-blue-50/40 text-blue-500 border-blue-100/50 dark:bg-blue-950/20 dark:border-blue-950/30'
                              : notif.type === 'sms'
                              ? 'bg-emerald-50/40 text-emerald-500 border-emerald-100/50 dark:bg-emerald-950/20 dark:border-emerald-950/30'
                              : 'bg-violet-50/40 text-violet-500 border-violet-100/50 dark:bg-violet-950/20 dark:border-violet-950/30'
                          }`}>
                            {notif.type === 'email' && <Mail className="w-4 h-4" />}
                            {notif.type === 'sms' && <MessageSquare className="w-4 h-4" />}
                            {notif.type === 'push' && <Bell className="w-4 h-4" />}
                          </div>
                          <span className="capitalize text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {notif.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            {notif.title}
                            {notif.link && (
                              <a
                                href={notif.link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block p-0.5 text-muted-foreground hover:text-indigo-500 transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </p>
                          {notif.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {notif.description}
                            </p>
                          )}
                          {notif.metadata && Object.keys(notif.metadata).length > 0 && (
                            <pre className="text-[10px] bg-slate-50 dark:bg-slate-900 border border-border p-1.5 rounded mt-1.5 font-mono overflow-x-auto text-slate-600 dark:text-slate-400 max-h-24">
                              {JSON.stringify(notif.metadata, null, 2)}
                            </pre>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hasDetails ? (
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                              {notif.user_details?.full_name || 'Anonymous User'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {notif.user_details?.email}
                            </p>
                            <Badge className="mt-1 text-[10px] font-semibold bg-slate-100 text-slate-600 border-none dark:bg-slate-800 dark:text-slate-400">
                              {notif.user_details?.role || 'CLIENT'}
                            </Badge>
                          </div>
                        ) : (
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                              External Recipient
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                              ID: {notif.user}
                            </p>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400 text-xs">
                        {new Date(notif.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          className={`font-semibold text-xs border ${
                            notif.is_read
                              ? 'bg-emerald-50/60 text-emerald-600 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-950/40'
                              : 'bg-amber-50/60 text-amber-600 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-950/40'
                          }`}
                        >
                          {notif.is_read ? 'Read' : 'Unread'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {!notif.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(notif.id)}
                              title="Mark as read"
                              className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg text-emerald-600 hover:text-emerald-700 transition-colors border border-transparent hover:border-emerald-200/30"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setNotifToDelete(notif)}
                            title="Delete notification"
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-red-500 hover:text-red-600 transition-colors border border-transparent hover:border-red-200/30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={!!notifToDelete}
        title="Delete Notification"
        description={`Are you sure you want to permanently delete notification "${notifToDelete?.title}"? This action is irreversible.`}
        isLoading={isDeleting}
        onConfirm={handleDeleteNotification}
        onCancel={() => setNotifToDelete(null)}
      />

      {/* Create Notification Dialog */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-lg border border-slate-100 dark:border-slate-800/80 shadow-2xl bg-white dark:bg-slate-950 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
              Create Alert Dispatch
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Select a client/pro recipient and fill in alert parameters to trigger direct notification dispatch.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateNotification} className="space-y-4 py-3">
            {/* Recipient User Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Recipient User *
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Filter users by email or name..."
                  value={userSearchQuery}
                  onChange={e => setUserSearchQuery(e.target.value)}
                  className="h-10 border-slate-200 dark:border-slate-800"
                />
              </div>
              <select
                value={targetUserId}
                onChange={e => setTargetUserId(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-foreground text-sm font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all cursor-pointer mt-1"
              >
                <option value="">-- Choose Recipient ({filteredUsers.length} users match) --</option>
                {filteredUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.email} ({u.full_name || 'Anonymous'}) [{u.role}]
                  </option>
                ))}
              </select>
            </div>

            {/* Linked Resource Selector (Visible after target user is selected) */}
            {targetUserId && (
              <Card className="p-3 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <Link2 className="w-3.5 h-3.5 text-indigo-500" />
                  Link to Platform Resource (Optional)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <select
                      value={linkedResourceType}
                      onChange={e => {
                        setLinkedResourceType(e.target.value);
                        handleResourceChange(e.target.value, '');
                      }}
                      className="w-full h-9 px-2 rounded-md border border-slate-200 dark:border-slate-800 bg-background text-xs font-medium focus:border-indigo-500 outline-none"
                    >
                      <option value="">-- No Link --</option>
                      <option value="item">Product / Service</option>
                      <option value="reel">Reel Video</option>
                      <option value="story">Story</option>
                      <option value="comment">User Comment</option>
                      <option value="promotion">Promotion</option>
                    </select>
                  </div>

                  <div>
                    {loadingResources ? (
                      <div className="flex items-center justify-center h-9 text-xs text-muted-foreground gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                        Loading options...
                      </div>
                    ) : (
                      linkedResourceType && (
                        <select
                          value={linkedResourceId}
                          onChange={e => handleResourceChange(linkedResourceType, e.target.value)}
                          className="w-full h-9 px-2 rounded-md border border-slate-200 dark:border-slate-800 bg-background text-xs font-medium focus:border-indigo-500 outline-none"
                        >
                          <option value="">-- Select {linkedResourceType} --</option>
                          
                          {linkedResourceType === 'item' && items.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name} ({item.price} TND)
                            </option>
                          ))}

                          {linkedResourceType === 'reel' && reels.map(reel => (
                            <option key={reel.id} value={reel.id}>
                              {reel.title} ({reel.category || 'No Category'})
                            </option>
                          ))}

                          {linkedResourceType === 'story' && stories.map(story => (
                            <option key={story.id} value={story.id}>
                              {story.caption ? story.caption.substring(0, 30) + '...' : `Story #${story.id}`}
                            </option>
                          ))}

                          {linkedResourceType === 'promotion' && promotions.map(promo => (
                            <option key={promo.id} value={promo.id}>
                              {promo.title} ({promo.discount_percent}%)
                            </option>
                          ))}

                          {linkedResourceType === 'comment' && comments.map(comment => (
                            <option key={comment.id} value={comment.id}>
                              {comment.content ? comment.content.substring(0, 30) + '...' : `Comment #${comment.id}`}
                            </option>
                          ))}
                        </select>
                      )
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Notification Type & Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Dispatch Channel *
                </label>
                <select
                  value={notifType}
                  onChange={e => setNotifType(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-foreground text-sm font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
                >
                  <option value="push">Push Notification</option>
                  <option value="email">Email Alert</option>
                  <option value="sms">SMS text</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Target Link (Optional)
                </label>
                <Input
                  placeholder="e.g. /dashboard/bookings"
                  value={notifLink}
                  onChange={e => setNotifLink(e.target.value)}
                  className="h-10 border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Alert Title *
              </label>
              <Input
                placeholder="Alert summary title"
                value={notifTitle}
                onChange={e => setNotifTitle(e.target.value)}
                required
                className="h-10 border-slate-200 dark:border-slate-800"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Alert Description
              </label>
              <Textarea
                placeholder="Write description content here..."
                value={notifDescription}
                onChange={e => setNotifDescription(e.target.value)}
                className="min-h-[80px] border-slate-200 dark:border-slate-800"
              />
            </div>

            {/* Metadata (JSON) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                JSON Metadata (Optional)
              </label>
              <Textarea
                placeholder='e.g., {"order_id": 123}'
                value={notifMetadata}
                onChange={e => setNotifMetadata(e.target.value)}
                className="font-mono text-xs min-h-[60px] border-slate-200 dark:border-slate-800"
              />
            </div>

            <DialogFooter className="gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                disabled={isSubmitting}
                className="h-10 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all active:scale-95"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-95"
              >
                {isSubmitting ? 'Dispatching...' : 'Dispatch Alert'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Confirmation Dialog Helper ─────────────────────────────────────────────────────
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({ open, title, description, isLoading, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onCancel()}>
      <DialogContent className="sm:max-w-sm border border-slate-100 dark:border-slate-800/80 shadow-2xl bg-white dark:bg-slate-950">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          <DialogDescription className="text-sm mt-1 text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 pt-4">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
