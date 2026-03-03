'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SettingSection {
  title: string;
  description: string;
  settings: Setting[];
}

interface Setting {
  label: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'toggle' | 'select';
  options?: { label: string; value: string }[];
}

const settingsSections: SettingSection[] = [
  {
    title: 'Commission Settings',
    description: 'Configure platform commission rates and payment terms',
    settings: [
      { label: 'Default Commission Rate', value: 15, type: 'number' },
      { label: 'Minimum Commission', value: 5, type: 'number' },
      { label: 'Premium Seller Rate', value: 10, type: 'number' },
      { label: 'Payment Cycle', value: 'weekly', type: 'select', options: [{ label: 'Weekly', value: 'weekly' }, { label: 'Bi-weekly', value: 'biweekly' }, { label: 'Monthly', value: 'monthly' }] },
    ],
  },
  {
    title: 'Verification Rules',
    description: 'Set requirements for business and user verification',
    settings: [
      { label: 'Require ID Verification', value: true, type: 'toggle' },
      { label: 'Require Business License', value: true, type: 'toggle' },
      { label: 'Require Tax ID', value: false, type: 'toggle' },
      { label: 'Auto-approve Low-Risk', value: true, type: 'toggle' },
    ],
  },
  {
    title: 'Report Thresholds',
    description: 'Configure when content is automatically flagged or removed',
    settings: [
      { label: 'Auto-Flag Threshold', value: 3, type: 'number' },
      { label: 'Auto-Hide Threshold', value: 5, type: 'number' },
      { label: 'Auto-Ban Threshold', value: 10, type: 'number' },
      { label: 'Spam Score Threshold', value: 70, type: 'number' },
    ],
  },
  {
    title: 'Review Limits',
    description: 'Control review posting and moderation settings',
    settings: [
      { label: 'Min Reviews Per User', value: 1, type: 'number' },
      { label: 'Max Reviews Per Day', value: 20, type: 'number' },
      { label: 'Review Minimum Length', value: 10, type: 'number' },
      { label: 'New User Review Delay (days)', value: 7, type: 'number' },
    ],
  },
  {
    title: 'Featured Pricing',
    description: 'Set pricing for featured/promoted listings',
    settings: [
      { label: 'Featured Product Daily Rate (AED)', value: 50, type: 'number' },
      { label: 'Featured Business Daily Rate (AED)', value: 100, type: 'number' },
      { label: 'Minimum Featured Duration (days)', value: 7, type: 'number' },
      { label: 'Maximum Featured Duration (days)', value: 90, type: 'number' },
    ],
  },
  {
    title: 'Subscription Plans',
    description: 'Configure subscription tiers for sellers',
    settings: [
      { label: 'Basic Plan Price (AED)', value: 199, type: 'number' },
      { label: 'Pro Plan Price (AED)', value: 499, type: 'number' },
      { label: 'Enterprise Plan Price (AED)', value: 1499, type: 'number' },
      { label: 'Trial Period (days)', value: 14, type: 'number' },
    ],
  },
];

export default function SettingsPage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    Object.fromEntries(settingsSections.map((section, idx) => [idx.toString(), idx === 0]))
  );

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index.toString()]: !prev[index.toString()],
    }));
  };

  const handleSave = (sectionIndex: number) => {
    console.log('[v0] Saving settings for section:', settingsSections[sectionIndex].title);
    // TODO: Connect to Supabase to save settings
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Configure platform rules, pricing, and policies</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(sectionIndex)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
            >
              <div>
                <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
              </div>
              {expandedSections[sectionIndex.toString()] ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
              )}
            </button>

            {/* Section Content */}
            {expandedSections[sectionIndex.toString()] && (
              <>
                <div className="border-t border-border px-6 py-6">
                  <div className="space-y-6">
                    {section.settings.map((setting, settingIndex) => (
                      <div key={settingIndex} className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">{setting.label}</label>
                        <div className="flex items-center gap-2">
                          {setting.type === 'toggle' ? (
                            <button
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                setting.value ? 'bg-primary' : 'bg-muted'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  setting.value ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          ) : setting.type === 'select' ? (
                            <select
                              value={setting.value}
                              className="bg-muted border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                            >
                              {setting.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={setting.type}
                              value={setting.value}
                              className="bg-muted border border-border rounded px-3 py-2 text-sm text-foreground w-32 focus:outline-none focus:ring-2 focus:ring-ring/50"
                              readOnly
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section Footer */}
                <div className="border-t border-border px-6 py-4 bg-muted/30 flex justify-end gap-3">
                  <Button variant="outline">Discard</Button>
                  <Button onClick={() => handleSave(sectionIndex)}>Save Changes</Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Role Management Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Role Permissions</h3>

        <div className="space-y-6">
          {['Admin', 'Moderator', 'Analyst'].map((role) => (
            <div key={role}>
              <h4 className="text-sm font-medium text-foreground mb-3">{role}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'View Dashboard',
                  'Manage Users',
                  'Moderate Content',
                  'Manage Reports',
                  'Generate Analytics',
                  'Configure Settings',
                  'Manage Admins',
                  'View Logs',
                  'Export Data',
                ].map((permission) => (
                  <label key={permission} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={role === 'Admin'}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm text-foreground">{permission}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline">Discard</Button>
          <Button>Save Permissions</Button>
        </div>
      </div>

      {/* Broadcast Messages Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Broadcast Messages</h3>
        <p className="text-sm text-muted-foreground mb-4">Send system announcements to all users</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Message</label>
            <textarea
              placeholder="Enter your message..."
              className="w-full bg-muted border border-border rounded px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 min-h-24 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Target Audience</label>
              <select className="w-full bg-muted border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
                <option>All Users</option>
                <option>Sellers Only</option>
                <option>Buyers Only</option>
                <option>Unverified Businesses</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Priority</label>
              <select className="w-full bg-muted border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
                <option>Info</option>
                <option>Warning</option>
                <option>Critical</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Discard</Button>
            <Button>Send Message</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
