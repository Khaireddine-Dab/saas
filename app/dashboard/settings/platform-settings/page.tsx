'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Setting {
  label: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'toggle' | 'select';
  options?: { label: string; value: string }[];
}

interface SettingSection {
  title: string;
  description: string;
  settings: Setting[];
}

const settingsSections: SettingSection[] = [
  {
    title: 'Commission Settings',
    description: 'Configure platform commission rates and payment terms',
    settings: [
      { label: 'Default Commission Rate (%)', value: 15, type: 'number' },
      { label: 'Minimum Commission (%)', value: 5, type: 'number' },
      { label: 'Premium Seller Rate (%)', value: 10, type: 'number' },
      {
        label: 'Payment Cycle', value: 'weekly', type: 'select',
        options: [
          { label: 'Weekly', value: 'weekly' },
          { label: 'Bi-weekly', value: 'biweekly' },
          { label: 'Monthly', value: 'monthly' },
        ],
      },
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
      { label: 'Review Minimum Length (chars)', value: 10, type: 'number' },
      { label: 'New User Review Delay (days)', value: 7, type: 'number' },
    ],
  },
  {
    title: 'Featured Pricing',
    description: 'Set pricing for featured / promoted listings',
    settings: [
      { label: 'Featured Product Daily Rate (TND)', value: 50, type: 'number' },
      { label: 'Featured Business Daily Rate (TND)', value: 100, type: 'number' },
      { label: 'Minimum Featured Duration (days)', value: 7, type: 'number' },
      { label: 'Maximum Featured Duration (days)', value: 90, type: 'number' },
    ],
  },
  {
    title: 'Subscription Plans',
    description: 'Configure subscription tiers for sellers',
    settings: [
      { label: 'Basic Plan Price (TND)', value: 199, type: 'number' },
      { label: 'Pro Plan Price (TND)', value: 499, type: 'number' },
      { label: 'Enterprise Plan Price (TND)', value: 1499, type: 'number' },
      { label: 'Trial Period (days)', value: 14, type: 'number' },
    ],
  },
];

const inputCls =
  'bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition w-36';

export default function PlatformSettingsPage() {
  const [values, setValues] = useState<Record<string, Record<number, string | number | boolean>>>(
    Object.fromEntries(
      settingsSections.map((sec, si) => [
        si,
        Object.fromEntries(sec.settings.map((s, i) => [i, s.value])),
      ])
    )
  );

  const [expanded, setExpanded] = useState<Record<number, boolean>>(
    Object.fromEntries(settingsSections.map((_, i) => [i, i === 0]))
  );

  const toggle = (i: number) => setExpanded(p => ({ ...p, [i]: !p[i] }));

  const setValue = (si: number, idx: number, val: string | number | boolean) =>
    setValues(p => ({ ...p, [si]: { ...p[si], [idx]: val } }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Platform Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure platform rules, pricing, and operational policies.
        </p>
      </div>

      <div className="space-y-3">
        {settingsSections.map((section, si) => (
          <div key={si} className="border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <button
              onClick={() => toggle(si)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted/40 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{section.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{section.description}</p>
              </div>
              {expanded[si]
                ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-4" />
                : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-4" />
              }
            </button>

            {/* Body */}
            {expanded[si] && (
              <>
                <div className="border-t border-border px-5 py-5 space-y-5 bg-card">
                  {section.settings.map((setting, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <label className="text-sm font-medium text-foreground flex-1">
                        {setting.label}
                      </label>
                      {setting.type === 'toggle' ? (
                        <button
                          onClick={() => setValue(si, idx, !values[si][idx])}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                            values[si][idx] ? 'bg-primary' : 'bg-muted-foreground/30'
                          }`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                            values[si][idx] ? 'translate-x-4' : 'translate-x-0.5'
                          }`} />
                        </button>
                      ) : setting.type === 'select' ? (
                        <select
                          value={values[si][idx] as string}
                          onChange={e => setValue(si, idx, e.target.value)}
                          className={inputCls}
                        >
                          {setting.options?.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="number"
                          value={values[si][idx] as number}
                          onChange={e => setValue(si, idx, Number(e.target.value))}
                          className={inputCls}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="border-t border-border px-5 py-3 bg-muted/20 flex justify-end gap-3">
                  <Button variant="outline" size="sm">Discard</Button>
                  <Button size="sm">Save Changes</Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}