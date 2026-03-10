'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, MessageSquare, Link2, Mail, Phone, Settings } from 'lucide-react';

type PluginTab = 'payment' | 'sms' | 'third-party' | 'email' | 'calling';

const pluginTabs: { id: PluginTab; label: string; icon: any }[] = [
  { id: 'payment', label: 'Payment Gateway', icon: CreditCard },
  { id: 'sms', label: 'SMS Gateway', icon: MessageSquare },
  { id: 'third-party', label: 'Third Party', icon: Link2 },
  { id: 'email', label: 'Email Services', icon: Mail },
  { id: 'calling', label: 'Calling Services', icon: Phone },
];

const pluginsData: Record<PluginTab, { id: string; name: string; desc: string; logo: string }[]> = {
  payment: [
    { id: 'stripe', name: 'Stripe', desc: 'Global payment processing with subscription & marketplace support.', logo: '💳' },
    { id: 'paypal', name: 'PayPal', desc: 'Widely trusted online payment solution with buyer protection.', logo: '🅿️' },
    { id: 'razorpay', name: 'RazorPay', desc: 'Indian-based gateway supporting UPI, wallets, and cards.', logo: '⚡' },
    { id: 'greenpay', name: 'GreenPay', desc: 'Eco-friendly payment platform for sustainable transactions.', logo: '🌿' },
    { id: 'flexpay', name: 'Flex Pay', desc: 'Flexible recurring billing and mobile wallet solution.', logo: '🔄' },
    { id: 'ccavenue', name: 'CCAvenue', desc: 'Middle Eastern payment platform with multi-currency support.', logo: '💰' },
    { id: 'hyperpay', name: 'HyperPay', desc: 'MENA-focused gateway with comprehensive local payment options.', logo: '🏦' },
    { id: 'dpo', name: 'DPO Group', desc: 'Pan-African gateway providing local payment methods.', logo: '🌍' },
  ],
  sms: [
    { id: 'twilio', name: 'Twilio', desc: 'Leading cloud communications platform for SMS & voice.', logo: '📡' },
    { id: 'nexmo', name: 'Vonage (Nexmo)', desc: 'Global SMS API with delivery receipts and number masking.', logo: '📨' },
    { id: 'aws_sns', name: 'AWS SNS', desc: 'Amazon Simple Notification Service for high-volume SMS.', logo: '☁️' },
    { id: 'msg91', name: 'MSG91', desc: 'India-focused bulk SMS and OTP delivery service.', logo: '💬' },
  ],
  'third-party': [
    { id: 'google_maps', name: 'Google Maps', desc: 'Maps, geocoding, and places API integration.', logo: '🗺️' },
    { id: 'firebase', name: 'Firebase', desc: 'Push notifications and real-time database.', logo: '🔥' },
    { id: 'algolia', name: 'Algolia', desc: 'AI-powered search and discovery platform.', logo: '🔍' },
    { id: 'cloudinary', name: 'Cloudinary', desc: 'Media management, optimization and CDN delivery.', logo: '🖼️' },
  ],
  email: [
    { id: 'sendgrid', name: 'SendGrid', desc: 'Transactional and marketing email delivery at scale.', logo: '📧' },
    { id: 'mailgun', name: 'Mailgun', desc: 'Developer-friendly email API with analytics.', logo: '📮' },
    { id: 'resend', name: 'Resend', desc: 'Modern email for developers with React email support.', logo: '✉️' },
    { id: 'ses', name: 'Amazon SES', desc: 'Cost-effective bulk and transactional email service.', logo: '📬' },
  ],
  calling: [
    { id: 'twilio_voice', name: 'Twilio Voice', desc: 'Programmable voice calls and IVR systems.', logo: '📞' },
    { id: 'agora', name: 'Agora', desc: 'Real-time voice and video calling SDK.', logo: '🎙️' },
    { id: 'daily', name: 'Daily.co', desc: 'Embeddable video and audio calls via API.', logo: '🎥' },
    { id: 'vonage_voice', name: 'Vonage Voice', desc: 'Global voice API with SIP trunking support.', logo: '☎️' },
  ],
};

export default function PluginsPage() {
  const [activeTab, setActiveTab] = useState<PluginTab>('payment');
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [configOpen, setConfigOpen] = useState<string | null>(null);
  const [keys, setKeys] = useState<Record<string, string>>({});

  const toggle = (id: string) => setEnabled(e => ({ ...e, [id]: !e[id] }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Plugins</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enable and configure third-party service integrations.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl overflow-x-auto">
        {pluginTabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Plugin cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pluginsData[activeTab].map(plugin => (
          <div
            key={plugin.id}
            className={`bg-card border rounded-xl overflow-hidden transition-all ${
              enabled[plugin.id] ? 'border-primary/40 shadow-sm' : 'border-border'
            }`}
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                    {plugin.logo}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{plugin.name}</h4>
                    {enabled[plugin.id] && (
                      <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                        Active
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggle(plugin.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                    enabled[plugin.id] ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    enabled[plugin.id] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{plugin.desc}</p>
            </div>

            {enabled[plugin.id] && (
              <>
                <div className="border-t border-border px-5 py-2 flex items-center justify-between bg-muted/30">
                  <span className="text-xs text-muted-foreground">API Configuration</span>
                  <button
                    onClick={() => setConfigOpen(configOpen === plugin.id ? null : plugin.id)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Settings className="w-3 h-3" />
                    {configOpen === plugin.id ? 'Hide' : 'Configure'}
                  </button>
                </div>
                {configOpen === plugin.id && (
                  <div className="px-5 pb-5 pt-3 bg-muted/30 space-y-3">
                    {['API Key', 'Secret Key', 'Webhook URL'].map(field => (
                      <div key={field}>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">{field}</label>
                        <input
                          type={field.includes('Secret') ? 'password' : 'text'}
                          placeholder={`Enter ${field}`}
                          value={keys[`${plugin.id}_${field}`] || ''}
                          onChange={e => setKeys(k => ({ ...k, [`${plugin.id}_${field}`]: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                        />
                      </div>
                    ))}
                    <Button size="sm" className="w-full mt-1">Save Configuration</Button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}