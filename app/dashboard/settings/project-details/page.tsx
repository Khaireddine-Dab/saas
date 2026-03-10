'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Upload, Globe, Phone, Mail, MapPin,
  Facebook, Twitter, Instagram, Youtube, Linkedin,
  AlertTriangle, Search, DollarSign, Navigation,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProjectDetailsForm {
  appName: string; tagline: string;
  email: string; supportPhone: string; whatsapp: string; address: string; website: string;
  currency: string; language: string; timezone: string;
  playStoreUrl: string; appStoreUrl: string;
  facebook: string; twitter: string; instagram: string; youtube: string; linkedin: string; tiktok: string;
  metaTitle: string; metaDescription: string; metaKeywords: string;
  copyright: string; footerTagline: string;
  defaultLat: string; defaultLng: string; defaultCity: string; defaultRadius: string;
  maintenanceMode: boolean; maintenanceMessage: string;
}

const currencies = ['TND','USD','EUR','GBP','SAR','AED','MAD','DZD','EGP','QAR'];
const languages = [
  { value: 'en', label: '🇬🇧 English' },
  { value: 'fr', label: '🇫🇷 French' },
  { value: 'ar', label: '🇸🇦 Arabic' },
  { value: 'de', label: '🇩🇪 German' },
  { value: 'es', label: '🇪🇸 Spanish' },
];
const timezones = [
  'Africa/Tunis','Africa/Casablanca','Africa/Cairo',
  'Europe/Paris','Europe/London','America/New_York',
  'America/Los_Angeles','Asia/Riyadh','Asia/Dubai',
];
const radiusOptions = ['1','5','10','20','30','50','100'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const inputCls = 'w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition';

function Section({ title, step, icon, children }: { title: string; step: string; icon?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0">{step}</span>
        {icon && <span>{icon}</span>}
        {title}
      </h3>
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, required, col2, children }: { label: string; hint?: string; required?: boolean; col2?: boolean; children: React.ReactNode }) {
  return (
    <div className={col2 ? 'sm:col-span-2' : ''}>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1 block">
        {label}{required && <span className="text-primary ml-0.5">*</span>}
        {hint && <span className="text-muted-foreground/50 font-normal">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function IconInput({ icon: Icon, className: cls, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon: any }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input {...props} className={`${inputCls} pl-9 ${cls || ''}`} />
    </div>
  );
}

function UploadBox({ label, hint, icon }: { label: string; hint: string; icon: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-1.5">{label}</p>
      <div className="flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-border rounded-xl py-5 bg-muted/20 hover:border-primary/40 hover:bg-primary/5 transition cursor-pointer group">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition">Click to upload</span>
        <span className="text-[11px] text-muted-foreground/50">{hint}</span>
        <Upload className="w-3.5 h-3.5 text-muted-foreground/40 mt-0.5" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProjectDetailsPage() {
  const [form, setForm] = useState<ProjectDetailsForm>({
    appName: 'Ro2ya', tagline: 'Discover local businesses around you',
    email: '', supportPhone: '', whatsapp: '', address: '', website: '',
    currency: 'TND', language: 'en', timezone: 'Africa/Tunis',
    playStoreUrl: '', appStoreUrl: '',
    facebook: '', twitter: '', instagram: '', youtube: '', linkedin: '', tiktok: '',
    metaTitle: '', metaDescription: '', metaKeywords: '',
    copyright: `© ${new Date().getFullYear()} Ro2ya. All rights reserved.`, footerTagline: '',
    defaultLat: '36.8065', defaultLng: '10.1815', defaultCity: 'Tunis', defaultRadius: '10',
    maintenanceMode: false, maintenanceMessage: "We're performing scheduled maintenance. We'll be back shortly!",
  });

  const set = (key: keyof ProjectDetailsForm, value: any) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">Project Details</h2>
        <p className="text-sm text-muted-foreground mt-1">General information, branding, and platform-wide configuration.</p>
      </div>

      {/* Maintenance Mode */}
      <div className={`flex items-start justify-between gap-4 px-5 py-4 rounded-xl border-2 transition-all ${form.maintenanceMode ? 'bg-yellow-50 border-yellow-300 dark:bg-yellow-950/20 dark:border-yellow-600' : 'bg-card border-border'}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${form.maintenanceMode ? 'text-yellow-500' : 'text-muted-foreground'}`} />
          <div>
            <p className="text-sm font-semibold text-foreground">Maintenance Mode</p>
            <p className="text-xs text-muted-foreground mt-0.5">When enabled, users see a maintenance page instead of the app.</p>
            {form.maintenanceMode && (
              <div className="mt-3">
                <label className="text-xs font-medium text-muted-foreground block mb-1">Maintenance Message</label>
                <textarea value={form.maintenanceMessage} onChange={e => set('maintenanceMessage', e.target.value)}
                  className={`${inputCls} resize-none min-h-[70px] max-w-lg`} />
              </div>
            )}
          </div>
        </div>
        <button onClick={() => set('maintenanceMode', !form.maintenanceMode)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 mt-0.5 ${form.maintenanceMode ? 'bg-yellow-500' : 'bg-muted-foreground/30'}`}>
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* 1. Branding */}
      <Section title="Branding" step="1" icon="🎨">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="App Name" required>
            <input type="text" placeholder="e.g. Ro2ya" value={form.appName}
              onChange={e => set('appName', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Tagline">
            <input type="text" placeholder="e.g. Discover local businesses" value={form.tagline}
              onChange={e => set('tagline', e.target.value)} className={inputCls} />
          </Field>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <UploadBox label="App Logo" hint="PNG/SVG · 512×512" icon="🖼️" />
          <UploadBox label="Dark Logo" hint="PNG/SVG · 512×512" icon="🌙" />
          <UploadBox label="Favicon" hint="ICO/PNG · 32×32" icon="🔖" />
          <UploadBox label="Splash Screen" hint="PNG · 1080×1920" icon="📱" />
        </div>
      </Section>

      {/* 2. Contact Info */}
      <Section title="Contact Information" step="2" icon="📞">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Support Email">
            <IconInput icon={Mail} type="email" placeholder="support@ro2ya.com"
              value={form.email} onChange={e => set('email', e.target.value)} />
          </Field>
          <Field label="Support Phone">
            <IconInput icon={Phone} type="tel" placeholder="+216 XX XXX XXX"
              value={form.supportPhone} onChange={e => set('supportPhone', e.target.value)} />
          </Field>
          <Field label="WhatsApp Number">
            <IconInput icon={Phone} type="tel" placeholder="+216 XX XXX XXX"
              value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
          </Field>
          <Field label="Website">
            <IconInput icon={Globe} type="url" placeholder="https://ro2ya.com"
              value={form.website} onChange={e => set('website', e.target.value)} />
          </Field>
          <Field label="Business Address" col2>
            <IconInput icon={MapPin} type="text" placeholder="Tunis, Tunisia"
              value={form.address} onChange={e => set('address', e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* 3. Localization */}
      <Section title="Localization" step="3" icon="🌍">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Default Currency">
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select value={form.currency} onChange={e => set('currency', e.target.value)} className={`${inputCls} pl-9`}>
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </Field>
          <Field label="Default Language">
            <select value={form.language} onChange={e => set('language', e.target.value)} className={inputCls}>
              {languages.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </Field>
          <Field label="Timezone">
            <select value={form.timezone} onChange={e => set('timezone', e.target.value)} className={inputCls}>
              {timezones.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      {/* 4. Default Map Location */}
      <Section title="Default Map Location & Radius" step="4" icon="📍">
        <p className="text-xs text-muted-foreground -mt-1">Sets the map center and search radius when no user location is available.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Default City">
            <IconInput icon={MapPin} type="text" placeholder="e.g. Tunis"
              value={form.defaultCity} onChange={e => set('defaultCity', e.target.value)} />
          </Field>
          <Field label="Search Radius">
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select value={form.defaultRadius} onChange={e => set('defaultRadius', e.target.value)} className={`${inputCls} pl-9`}>
                {radiusOptions.map(r => <option key={r} value={r}>{r} km</option>)}
              </select>
            </div>
          </Field>
          <Field label="Default Latitude">
            <input type="text" placeholder="e.g. 36.8065" value={form.defaultLat}
              onChange={e => set('defaultLat', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Default Longitude">
            <input type="text" placeholder="e.g. 10.1815" value={form.defaultLng}
              onChange={e => set('defaultLng', e.target.value)} className={inputCls} />
          </Field>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 rounded-lg border border-border">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Centered on <span className="font-semibold text-foreground">{form.defaultCity || '—'}</span> ({form.defaultLat}, {form.defaultLng}) · radius <span className="font-semibold text-foreground">{form.defaultRadius} km</span>
          </p>
        </div>
      </Section>

      {/* 5. App Store Links */}
      <Section title="App Store Links" step="5" icon="📲">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Google Play Store">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">▶️</span>
              <input type="url" placeholder="https://play.google.com/store/apps/..."
                value={form.playStoreUrl} onChange={e => set('playStoreUrl', e.target.value)}
                className={`${inputCls} pl-9`} />
            </div>
          </Field>
          <Field label="Apple App Store">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🍎</span>
              <input type="url" placeholder="https://apps.apple.com/app/..."
                value={form.appStoreUrl} onChange={e => set('appStoreUrl', e.target.value)}
                className={`${inputCls} pl-9`} />
            </div>
          </Field>
        </div>
      </Section>

      {/* 6. Social Media */}
      <Section title="Social Media" step="6" icon="🔗">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Facebook"><IconInput icon={Facebook} type="url" placeholder="https://facebook.com/yourpage" value={form.facebook} onChange={e => set('facebook', e.target.value)} /></Field>
          <Field label="X (Twitter)"><IconInput icon={Twitter} type="url" placeholder="https://twitter.com/yourhandle" value={form.twitter} onChange={e => set('twitter', e.target.value)} /></Field>
          <Field label="Instagram"><IconInput icon={Instagram} type="url" placeholder="https://instagram.com/yourhandle" value={form.instagram} onChange={e => set('instagram', e.target.value)} /></Field>
          <Field label="YouTube"><IconInput icon={Youtube} type="url" placeholder="https://youtube.com/@yourchannel" value={form.youtube} onChange={e => set('youtube', e.target.value)} /></Field>
          <Field label="LinkedIn"><IconInput icon={Linkedin} type="url" placeholder="https://linkedin.com/company/..." value={form.linkedin} onChange={e => set('linkedin', e.target.value)} /></Field>
          <Field label="TikTok">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🎵</span>
              <input type="url" placeholder="https://tiktok.com/@yourhandle" value={form.tiktok}
                onChange={e => set('tiktok', e.target.value)} className={`${inputCls} pl-9`} />
            </div>
          </Field>
        </div>
      </Section>

      {/* 7. SEO */}
      <Section title="SEO" step="7" icon="🔍">
        <Field label="Meta Title">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Ro2ya — Discover Local Businesses in Tunisia"
              value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)}
              className={`${inputCls} pl-9`} />
          </div>
          <p className={`text-[11px] mt-1 ${form.metaTitle.length > 60 ? 'text-red-400' : 'text-muted-foreground/60'}`}>
            {form.metaTitle.length}/60 characters recommended
          </p>
        </Field>
        <Field label="Meta Description">
          <textarea placeholder="Find the best local businesses, restaurants, and services near you."
            value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)}
            className={`${inputCls} resize-none min-h-[80px]`} />
          <p className={`text-[11px] mt-1 ${form.metaDescription.length > 160 ? 'text-red-400' : 'text-muted-foreground/60'}`}>
            {form.metaDescription.length}/160 characters recommended
          </p>
        </Field>
        <Field label="Keywords" hint="Comma-separated">
          <input type="text" placeholder="marketplace, Tunisia, local businesses, directory"
            value={form.metaKeywords} onChange={e => set('metaKeywords', e.target.value)}
            className={inputCls} />
        </Field>
      </Section>

      {/* 8. Footer & Copyright */}
      <Section title="Footer & Copyright" step="8" icon="📄">
        <div className="grid grid-cols-1 gap-4">
          <Field label="Copyright Text">
            <input type="text" placeholder={`© ${new Date().getFullYear()} Ro2ya. All rights reserved.`}
              value={form.copyright} onChange={e => set('copyright', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Footer Tagline">
            <input type="text" placeholder="Your trusted local business discovery platform"
              value={form.footerTagline} onChange={e => set('footerTagline', e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Section>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline">Discard Changes</Button>
        <Button>Save Project Details</Button>
      </div>
    </div>
  );
}