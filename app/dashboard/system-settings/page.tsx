'use client';

import { Save, Lock, Palette, CreditCard, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General Settings', icon: '⚙️' },
    { id: 'branding', label: 'Branding', icon: '🎨' },
    { id: 'payment', label: 'Payment Gateways', icon: '💳' },
    { id: 'roles', label: 'Admin Roles', icon: '👥' },
    { id: 'security', label: 'Security', icon: '🔒' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
        <p className="text-muted-foreground">Manage platform configuration and administrative settings</p>
      </div>

      {/* Tabs */}
      <Card>
        <div className="flex border-b border-border">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-4">Platform Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Platform Name</label>
                    <Input placeholder="Enter platform name" defaultValue="Ro2ya" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Support Email</label>
                    <Input placeholder="support@example.com" defaultValue="support@ro2ya.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Commission Rate (%)</label>
                      <Input placeholder="0.00" defaultValue="15" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Min Order Value ($)</label>
                      <Input placeholder="0.00" defaultValue="10" />
                    </div>
                  </div>
                </div>
              </div>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          )}

          {/* Branding */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-4">Brand Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Primary Color</label>
                    <div className="flex gap-2">
                      <input type="color" defaultValue="#000000" className="w-12 h-10 rounded" />
                      <Input defaultValue="#000000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Secondary Color</label>
                    <div className="flex gap-2">
                      <input type="color" defaultValue="#f3f4f6" className="w-12 h-10 rounded" />
                      <Input defaultValue="#f3f4f6" />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4">Logo & Favicon</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Logo URL</label>
                    <Input placeholder="https://example.com/logo.png" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Favicon URL</label>
                    <Input placeholder="https://example.com/favicon.ico" />
                  </div>
                </div>
              </div>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Branding
              </Button>
            </div>
          )}

          {/* Payment Gateways */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {['Stripe', 'PayPal', 'Square'].map(gateway => (
                  <Card key={gateway} className="p-4 border">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{gateway}</h4>
                        <p className="text-sm text-muted-foreground mt-1">Configure {gateway} payment settings</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Disconnected</Badge>
                        <Button size="sm">Configure</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Admin Roles */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Manage Roles</h3>
                  <Button size="sm">
                    <Users className="w-3 h-3 mr-1" />
                    Add Role
                  </Button>
                </div>
                <div className="space-y-2">
                  {['Super Admin', 'Admin', 'Moderator', 'Analyst', 'Support'].map(role => (
                    <Card key={role} className="p-4 flex items-center justify-between hover:bg-muted/50">
                      <div>
                        <h4 className="font-medium text-foreground">{role}</h4>
                        <p className="text-xs text-muted-foreground mt-1">Full permissions</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground mt-1">Require 2FA for all admin accounts</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">API Rate Limiting</h4>
                      <p className="text-sm text-muted-foreground mt-1">Prevent brute force attacks</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">IP Whitelisting</h4>
                      <p className="text-sm text-muted-foreground mt-1">Restrict admin access by IP</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4">Session Management</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Session Timeout (minutes)</span>
                    <Input type="number" defaultValue="30" className="w-24" />
                  </div>
                </div>
              </div>
              <Button>
                <Lock className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
