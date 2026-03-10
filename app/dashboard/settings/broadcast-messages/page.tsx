'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, AlertTriangle, Info, AlertCircle, Users, Clock } from 'lucide-react';

type Priority = 'info' | 'warning' | 'critical';
type Audience = 'all' | 'sellers' | 'buyers' | 'unverified';

interface BroadcastForm {
  message: string;
  audience: Audience;
  priority: Priority;
  scheduledAt: string;
  scheduled: boolean;
}

const audienceOptions: { value: Audience; label: string; desc: string; icon: string }[] = [
  { value: 'all',        label: 'All Users',              desc: 'Everyone on the platform', icon: '👥' },
  { value: 'sellers',    label: 'Merchants Only',         desc: 'Business owners & sellers', icon: '🏪' },
  { value: 'buyers',     label: 'Customers Only',         desc: 'Regular app users', icon: '👤' },
  { value: 'unverified', label: 'Unverified Businesses',  desc: 'Pending verification', icon: '⚠️' },
];

const priorityOptions: {
  value: Priority; label: string; icon: React.ElementType;
  color: string; bg: string; border: string;
}[] = [
  { value: 'info',     label: 'Info',     icon: Info,          color: 'text-blue-500',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30' },
  { value: 'warning',  label: 'Warning',  icon: AlertTriangle, color: 'text-amber-500',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30' },
  { value: 'critical', label: 'Critical', icon: AlertCircle,   color: 'text-red-500',    bg: 'bg-red-500/10',    border: 'border-red-500/30' },
];

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition';

export default function BroadcastMessagesPage() {
  const [form, setForm] = useState<BroadcastForm>({
    message: '',
    audience: 'all',
    priority: 'info',
    scheduledAt: '',
    scheduled: false,
  });

  const set = (key: keyof BroadcastForm, val: any) => setForm(f => ({ ...f, [key]: val }));

  const selectedPriority = priorityOptions.find(p => p.value === form.priority)!;
  const PriorityIcon = selectedPriority.icon;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Broadcast Messages</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Send system-wide announcements to users on the platform.
        </p>
      </div>

      <div className="space-y-5">
        {/* Message */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Send className="w-4 h-4 text-muted-foreground" />
            Message Content
          </h3>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Message <span className="text-primary">*</span>
            </label>
            <textarea
              placeholder="Type your announcement here..."
              value={form.message}
              onChange={e => set('message', e.target.value)}
              className={`${inputCls} resize-none min-h-[110px]`}
            />
            <p className={`text-[11px] mt-1 ${form.message.length > 500 ? 'text-red-400' : 'text-muted-foreground/60'}`}>
              {form.message.length}/500 characters
            </p>
          </div>
        </div>

        {/* Audience */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            Target Audience
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {audienceOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => set('audience', opt.value)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                  form.audience === opt.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30 hover:bg-muted/30'
                }`}
              >
                <span className="text-xl">{opt.icon}</span>
                <div>
                  <p className={`text-sm font-semibold ${form.audience === opt.value ? 'text-primary' : 'text-foreground'}`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
                <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  form.audience === opt.value ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                }`}>
                  {form.audience === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <PriorityIcon className={`w-4 h-4 ${selectedPriority.color}`} />
            Priority Level
          </h3>
          <div className="flex gap-3 flex-wrap">
            {priorityOptions.map(({ value, label, icon: Icon, color, bg, border }) => (
              <button
                key={value}
                onClick={() => set('priority', value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  form.priority === value
                    ? `${bg} ${border} ${color}`
                    : 'border-border text-muted-foreground hover:border-border/80 hover:bg-muted/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {form.priority === 'info' && 'Informational message — displayed as a standard notification.'}
            {form.priority === 'warning' && 'Warning message — displayed prominently with a yellow indicator.'}
            {form.priority === 'critical' && 'Critical alert — displayed with high visibility across all surfaces.'}
          </p>
        </div>

        {/* Schedule */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Schedule (optional)
            </h3>
            <button
              onClick={() => set('scheduled', !form.scheduled)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                form.scheduled ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                form.scheduled ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
          {form.scheduled && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Send at</label>
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={e => set('scheduledAt', e.target.value)}
                className={inputCls}
              />
            </div>
          )}
          {!form.scheduled && (
            <p className="text-xs text-muted-foreground">Message will be sent immediately when you click "Send Message".</p>
          )}
        </div>

        {/* Preview banner */}
        {form.message && (
          <div className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border ${selectedPriority.bg} ${selectedPriority.border}`}>
            <PriorityIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${selectedPriority.color}`} />
            <div>
              <p className={`text-xs font-semibold ${selectedPriority.color} mb-0.5`}>Preview</p>
              <p className="text-sm text-foreground">{form.message}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setForm(f => ({ ...f, message: '', scheduledAt: '' }))}>
          Discard
        </Button>
        <Button disabled={!form.message.trim()} className="gap-2">
          <Send className="w-4 h-4" />
          {form.scheduled ? 'Schedule Message' : 'Send Message'}
        </Button>
      </div>
    </div>
  );
}