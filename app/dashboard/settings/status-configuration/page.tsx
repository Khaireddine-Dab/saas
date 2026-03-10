'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'on_the_way' | 'delivered' | 'cancelled' | 'refunded';

const orderStatuses: {
  id: OrderStatus;
  label: string;
  icon: string;
  color: string;
  bg: string;
  recipients: ('customer' | 'merchant' | 'driver' | 'admin')[];
}[] = [
  { id: 'pending', label: 'Pending', icon: '🕐', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', recipients: ['customer', 'merchant', 'admin'] },
  { id: 'accepted', label: 'Accepted', icon: '✅', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', recipients: ['customer', 'merchant'] },
  { id: 'preparing', label: 'Preparing', icon: '👨‍🍳', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', recipients: ['customer'] },
  { id: 'ready', label: 'Ready for Pickup', icon: '📦', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', recipients: ['customer', 'driver', 'merchant'] },
  { id: 'picked_up', label: 'Picked Up', icon: '🛵', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200', recipients: ['customer', 'merchant'] },
  { id: 'on_the_way', label: 'On The Way', icon: '🚀', color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-200', recipients: ['customer'] },
  { id: 'delivered', label: 'Delivered', icon: '🎉', color: 'text-green-600', bg: 'bg-green-50 border-green-200', recipients: ['customer', 'merchant', 'driver'] },
  { id: 'cancelled', label: 'Cancelled', icon: '❌', color: 'text-red-600', bg: 'bg-red-50 border-red-200', recipients: ['customer', 'merchant', 'admin'] },
  { id: 'refunded', label: 'Refunded', icon: '💸', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200', recipients: ['customer', 'admin'] },
];

const recipientLabels: Record<string, string> = {
  customer: '👤 Customer',
  merchant: '🏪 Merchant',
  driver: '🛵 Driver',
  admin: '🔧 Admin',
};

const notificationChannels = ['push', 'email', 'sms'] as const;
type Channel = typeof notificationChannels[number];

const channelLabels: Record<Channel, string> = {
  push: '🔔 Push',
  email: '📧 Email',
  sms: '💬 SMS',
};

interface StatusNotifConfig {
  enabled: boolean;
  channels: Record<Channel, boolean>;
  title: string;
  message: string;
}

export default function StatusConfigurationPage() {
  const defaultConfig = (): StatusNotifConfig => ({
    enabled: true,
    channels: { push: true, email: false, sms: false },
    title: '',
    message: '',
  });

  const [configs, setConfigs] = useState<Record<string, Record<string, StatusNotifConfig>>>(
    Object.fromEntries(
      orderStatuses.map(s => [
        s.id,
        Object.fromEntries(s.recipients.map(r => [r, defaultConfig()]))
      ])
    )
  );
  const [expandedStatus, setExpandedStatus] = useState<OrderStatus | null>('pending');

  const updateConfig = (statusId: string, recipient: string, patch: Partial<StatusNotifConfig>) => {
    setConfigs(prev => ({
      ...prev,
      [statusId]: {
        ...prev[statusId],
        [recipient]: { ...prev[statusId][recipient], ...patch },
      },
    }));
  };

  const updateChannel = (statusId: string, recipient: string, channel: Channel, val: boolean) => {
    setConfigs(prev => ({
      ...prev,
      [statusId]: {
        ...prev[statusId],
        [recipient]: {
          ...prev[statusId][recipient],
          channels: { ...prev[statusId][recipient].channels, [channel]: val },
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Status Configuration</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure which notifications are sent to each recipient when an order status changes.
        </p>
      </div>

      <div className="space-y-3">
        {orderStatuses.map(status => {
          const isOpen = expandedStatus === status.id;
          return (
            <div key={status.id} className={`border rounded-xl overflow-hidden transition-all ${isOpen ? 'border-primary/40 shadow-sm' : 'border-border'}`}>
              <button
                onClick={() => setExpandedStatus(isOpen ? null : status.id)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/30 transition text-left"
              >
                <span className="text-xl flex-shrink-0">{status.icon}</span>
                <div className="flex-1">
                  <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full border ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{status.recipients.length} recipients</span>
                  <span className={`transition-transform inline-block ${isOpen ? 'rotate-90' : ''}`}>›</span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border divide-y divide-border">
                  {status.recipients.map(recipient => {
                    const cfg = configs[status.id][recipient];
                    return (
                      <div key={recipient} className="px-5 py-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">{recipientLabels[recipient]}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{cfg.enabled ? 'Enabled' : 'Disabled'}</span>
                            <button
                              onClick={() => updateConfig(status.id, recipient, { enabled: !cfg.enabled })}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${cfg.enabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                            >
                              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${cfg.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                            </button>
                          </div>
                        </div>

                        {cfg.enabled && (
                          <>
                            <div className="flex items-center gap-2 flex-wrap">
                              {notificationChannels.map(channel => (
                                <button
                                  key={channel}
                                  onClick={() => updateChannel(status.id, recipient, channel, !cfg.channels[channel])}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                    cfg.channels[channel]
                                      ? 'bg-primary/10 border-primary/40 text-primary'
                                      : 'bg-muted border-border text-muted-foreground hover:border-primary/30'
                                  }`}
                                >
                                  {cfg.channels[channel] && <Check className="w-3 h-3" />}
                                  {channelLabels[channel]}
                                </button>
                              ))}
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                  Notification Title
                                </label>
                                <input
                                  type="text"
                                  placeholder={`e.g. Your order is ${status.label.toLowerCase()}`}
                                  value={cfg.title}
                                  onChange={e => updateConfig(status.id, recipient, { title: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center justify-between">
                                  <span>Message</span>
                                  <span className="text-[11px] text-muted-foreground/70">Use {'{{name}}'}, {'{{order_id}}'}, {'{{status}}'}</span>
                                </label>
                                <textarea
                                  placeholder={`e.g. Hi {{name}}, your order #{{order_id}} is now ${status.label.toLowerCase()}.`}
                                  value={cfg.message}
                                  onChange={e => updateConfig(status.id, recipient, { message: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none min-h-[80px]"
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Discard</Button>
        <Button>Save Notifications</Button>
      </div>
    </div>
  );
}