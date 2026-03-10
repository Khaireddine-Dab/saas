'use client';

import { useState } from 'react';
import { Bell, Plus, Search, Filter, Trash2, Check, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockNotifications = [
  { id: 1, type: 'email', title: 'Order Confirmation', body: 'Send order confirmation emails', status: 'active', recipients: 'All Customers', sent: 125400 },
  { id: 2, type: 'sms', title: 'Delivery Update', body: 'SMS updates for delivery status', status: 'active', recipients: 'Customers with Orders', sent: 85320 },
  { id: 3, type: 'push', title: 'Flash Sale Alert', body: 'Push notification for flash sales', status: 'scheduled', recipients: 'App Users', sent: 0 },
  { id: 4, type: 'email', title: 'Merchant Payout', body: 'Monthly payout notifications', status: 'active', recipients: 'All Merchants', sent: 2450 },
];

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredNotifications = mockNotifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !typeFilter || notif.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notification Center</h1>
          <p className="text-muted-foreground">Manage platform notifications and alerts</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Notification
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Sent</div>
          <div className="text-2xl font-bold">213,170</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Delivery Rate</div>
          <div className="text-2xl font-bold">98.5%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Open Rate</div>
          <div className="text-2xl font-bold">45.2%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Click Rate</div>
          <div className="text-2xl font-bold">12.8%</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={typeFilter || ''}
            onChange={(e) => setTypeFilter(e.target.value || undefined)}
            className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="">All Types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="push">Push Notification</option>
          </select>
        </div>
      </Card>

      {/* Notifications Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Type</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Title</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Recipients</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Sent</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredNotifications.map((notif) => (
                <tr key={notif.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {notif.type === 'email' && <Mail className="w-4 h-4 text-primary" />}
                      {notif.type === 'sms' && <MessageSquare className="w-4 h-4 text-green-500" />}
                      {notif.type === 'push' && <Bell className="w-4 h-4 text-purple-500" />}
                      <span className="capitalize text-sm font-medium text-foreground">{notif.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-foreground">{notif.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{notif.body}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{notif.recipients}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{notif.sent.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <Badge className={notif.status === 'active'
                      ? 'bg-green-500/20 text-green-500 border-green-500/40'
                      : 'bg-primary/20 text-primary border-primary/40'}>
                      {notif.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-muted rounded text-foreground transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-destructive/10 rounded text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
