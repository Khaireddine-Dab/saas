'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit2, Trash2, Send, Clock, Users } from 'lucide-react';

interface PushNotification {
  id: string;
  title: string;
  message: string;
  audience: 'all' | 'customers' | 'drivers' | 'merchants' | 'custom';
  status: 'draft' | 'scheduled' | 'sent' | 'sending';
  sentAt?: Date;
  scheduledFor?: Date;
  recipientCount: number;
  openRate?: number;
  clickRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

const mockNotifications: PushNotification[] = [
  {
    id: '1',
    title: 'New Year Sale - 40% Off!',
    message: 'Shop our exclusive New Year collection with up to 40% discount. Limited time only!',
    audience: 'all',
    status: 'sent',
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    recipientCount: 45320,
    openRate: 32.5,
    clickRate: 18.2,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Your Order is Ready for Pickup',
    message: 'Order #12345 is ready! Pick it up from our nearest branch today.',
    audience: 'customers',
    status: 'sent',
    sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    recipientCount: 3420,
    openRate: 78.5,
    clickRate: 45.2,
    createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Earn Extra Commission This Week',
    message: 'Complete 10 deliveries this week and earn an extra 20% commission bonus!',
    audience: 'drivers',
    status: 'sent',
    sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    recipientCount: 2850,
    openRate: 64.3,
    clickRate: 38.1,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: '4',
    title: 'Flash Sale - Electronics',
    message: 'Limited time flash sale on electronics. Save up to 50% now!',
    audience: 'all',
    status: 'scheduled',
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
    recipientCount: 0,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '5',
    title: 'Verify Your Account',
    message: 'Please verify your email to unlock all features. Tap to verify now.',
    audience: 'custom',
    status: 'draft',
    recipientCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const statusColors = {
  draft: 'bg-muted text-muted-foreground border-border',
  scheduled: 'bg-blue-500/20 text-blue-500 border-blue-500/40',
  sending: 'bg-purple-500/20 text-purple-500 border-purple-500/40',
  sent: 'bg-green-500/20 text-green-500 border-green-500/40',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<PushNotification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'scheduled' | 'sent'>('all');
  const [selectedNotification, setSelectedNotification] = useState<PushNotification | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || notif.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: notifications.length,
    sent: notifications.filter((n) => n.status === 'sent').length,
    scheduled: notifications.filter((n) => n.status === 'scheduled').length,
    draft: notifications.filter((n) => n.status === 'draft').length,
    totalRecipients: notifications
      .filter((n) => n.status === 'sent')
      .reduce((sum, n) => sum + n.recipientCount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Push Notifications</h1>
          <p className="text-muted-foreground">Create and manage push notification campaigns</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Campaigns</div>
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          <div className="text-xs text-muted-foreground mt-1">All time</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Sent</div>
          <div className="text-2xl font-bold text-green-500">{stats.sent}</div>
          <div className="text-xs text-muted-foreground mt-1">Completed</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Scheduled</div>
          <div className="text-2xl font-bold text-blue-500">{stats.scheduled}</div>
          <div className="text-xs text-muted-foreground mt-1">Pending</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Recipients</div>
          <div className="text-2xl font-bold text-foreground">
            {(stats.totalRecipients / 1000).toFixed(1)}K
          </div>
          <div className="text-xs text-muted-foreground mt-1">Reached</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No notifications found</p>
          </Card>
        ) : (
          filteredNotifications.map((notif) => (
            <Card key={notif.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{notif.title}</h3>
                    <Badge className={statusColors[notif.status as keyof typeof statusColors]}>{notif.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{notif.message}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {notif.audience}
                    </div>
                    {notif.sentAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Sent {new Date(notif.sentAt).toLocaleDateString()}
                      </div>
                    )}
                    {notif.scheduledFor && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Scheduled for {new Date(notif.scheduledFor).toLocaleDateString()}
                      </div>
                    )}
                    {notif.recipientCount > 0 && (
                      <div>{notif.recipientCount.toLocaleString()} recipients</div>
                    )}
                  </div>

                  {notif.openRate !== undefined && (
                    <div className="mt-3 grid grid-cols-3 gap-3 p-3 bg-muted rounded text-xs border border-border">
                      <div>
                        <div className="text-muted-foreground font-medium">Open Rate</div>
                        <div className="font-bold text-foreground">{notif.openRate}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground font-medium">Click Rate</div>
                        <div className="font-bold text-foreground">{notif.clickRate}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground font-medium">Conversion</div>
                        <div className="font-bold text-foreground">12.3%</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedNotification(notif);
                      setShowPreview(true);
                    }}
                  >
                    Preview
                  </Button>
                  {notif.status === 'draft' && (
                    <Button size="sm" variant="outline" onClick={() => { }}>
                      <Send className="w-4 h-4 mr-1" />
                      Send
                    </Button>
                  )}
                  {notif.status !== 'sent' && (
                    <Button size="sm" variant="outline">
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4 p-6">
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Notification Preview</h2>

              {/* Mobile Preview */}
              <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted space-y-3">
                <div className="text-sm text-muted-foreground font-medium">Mobile Preview</div>
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-2">
                  <div className="font-semibold text-sm text-foreground">{selectedNotification.title}</div>
                  <div className="text-xs text-muted-foreground">{selectedNotification.message}</div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Audience:</span>
                  <span className="font-medium">{selectedNotification.audience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={statusColors[selectedNotification.status as keyof typeof statusColors]}>
                    {selectedNotification.status}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
