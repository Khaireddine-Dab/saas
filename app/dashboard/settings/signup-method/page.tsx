'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const signupMethods = [
  { id: 'magic_link', label: 'Magic Link', desc: 'Passwordless login via email link', icon: '✉️' },
  { id: 'email_password', label: 'Email & Password', desc: 'Traditional email + password auth', icon: '🔑' },
  { id: 'otp_email', label: 'OTP via Email', desc: 'One-time password sent to email', icon: '📧' },
  { id: 'otp_sms', label: 'OTP via SMS', desc: 'One-time password sent via SMS', icon: '📱' },
  { id: 'phone', label: 'Phone Number', desc: 'Sign up with phone number only', icon: '☎️' },
];

const socialProviders = [
  { id: 'google', label: 'Google', icon: '🔵' },
  { id: 'facebook', label: 'Facebook', icon: '🔷' },
  { id: 'apple', label: 'Apple', icon: '🍎' },
  { id: 'twitter', label: 'X (Twitter)', icon: '🐦' },
  { id: 'github', label: 'GitHub', icon: '🐙' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
];

export default function SignupMethodPage() {
  const [methods, setMethods] = useState<Record<string, boolean>>(
    Object.fromEntries(signupMethods.map((m, i) => [m.id, i < 2]))
  );
  const [socials, setSocials] = useState<Record<string, boolean>>(
    Object.fromEntries(socialProviders.map((s, i) => [s.id, i < 2]))
  );
  const [clientIds, setClientIds] = useState<Record<string, string>>(
    Object.fromEntries(socialProviders.map(s => [s.id, '']))
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Sign Up Method</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure how users can register and log in to the platform.
        </p>
      </div>

      {/* Auth Methods */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-5 h-5 bg-primary/10 text-primary rounded flex items-center justify-center text-xs">1</span>
          Authentication Methods
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {signupMethods.map(method => (
            <div
              key={method.id}
              onClick={() => setMethods(m => ({ ...m, [method.id]: !m[method.id] }))}
              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                methods[method.id]
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <span className="text-2xl">{method.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">{method.label}</p>
                <p className="text-xs text-muted-foreground truncate">{method.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                methods[method.id] ? 'border-primary bg-primary' : 'border-border'
              }`}>
                {methods[method.id] && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Login */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-5 h-5 bg-primary/10 text-primary rounded flex items-center justify-center text-xs">2</span>
          Social Login Providers
        </h3>
        <div className="space-y-3">
          {socialProviders.map(provider => (
            <div
              key={provider.id}
              className={`border rounded-xl overflow-hidden transition-all ${
                socials[provider.id] ? 'border-primary/40' : 'border-border'
              }`}
            >
              <div className="flex items-center gap-3 px-4 py-3 bg-card">
                <span className="text-xl">{provider.icon}</span>
                <span className="font-medium text-sm text-foreground flex-1">{provider.label}</span>
                <button
                  onClick={() => setSocials(s => ({ ...s, [provider.id]: !s[provider.id] }))}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    socials[provider.id] ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                    socials[provider.id] ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              {socials[provider.id] && (
                <div className="px-4 pb-4 pt-2 bg-muted/30 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Client ID</label>
                    <input
                      type="text"
                      placeholder="Enter Client ID"
                      value={clientIds[`${provider.id}_id`] || ''}
                      onChange={e => setClientIds(c => ({ ...c, [`${provider.id}_id`]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Client Secret</label>
                    <input
                      type="password"
                      placeholder="Enter Client Secret"
                      value={clientIds[`${provider.id}_secret`] || ''}
                      onChange={e => setClientIds(c => ({ ...c, [`${provider.id}_secret`]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Discard</Button>
        <Button>Save Auth Settings</Button>
      </div>
    </div>
  );
}