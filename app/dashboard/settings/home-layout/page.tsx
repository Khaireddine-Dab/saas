'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

const defaultSections = [
  { id: 'hero', label: 'Hero Banner', icon: '🏠', enabled: true },
  { id: 'featured', label: 'Featured Businesses', icon: '⭐', enabled: true },
  { id: 'categories', label: 'Categories', icon: '🗂️', enabled: true },
  { id: 'nearby', label: 'Nearby Places', icon: '📍', enabled: true },
  { id: 'popular', label: 'Popular Reviews', icon: '💬', enabled: true },
  { id: 'cta', label: 'Call to Action Banner', icon: '📣', enabled: true },
  { id: 'blog', label: 'Blog / Articles', icon: '📰', enabled: false },
  { id: 'partners', label: 'Partners & Sponsors', icon: '🤝', enabled: false },
];

export default function HomeLayoutPage() {
  const [sections, setSections] = useState(defaultSections);

  const move = (id: string, dir: -1 | 1) => {
    setSections(prev => {
      const idx = prev.findIndex(s => s.id === id);
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  };

  const toggle = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Home Layout</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Reorder sections or toggle their visibility on the homepage.
        </p>
      </div>

      <div className="space-y-2">
        {sections.map((section, i) => (
          <div
            key={section.id}
            className={`flex items-center gap-3 bg-card border rounded-xl px-4 py-3.5 transition-all ${
              section.enabled ? 'border-border' : 'border-dashed border-border opacity-60'
            }`}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab flex-shrink-0" />
            <span className="text-xl flex-shrink-0">{section.icon}</span>
            <span className="flex-1 font-medium text-sm text-foreground">{section.label}</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">#{i + 1}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => move(section.id, -1)}
                disabled={i === 0}
                className="p-1 rounded hover:bg-muted disabled:opacity-20 transition"
              >
                <ArrowUp className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button
                onClick={() => move(section.id, 1)}
                disabled={i === sections.length - 1}
                className="p-1 rounded hover:bg-muted disabled:opacity-20 transition"
              >
                <ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
            <button
              onClick={() => toggle(section.id)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                section.enabled ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                section.enabled ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setSections(defaultSections)}>Reset</Button>
        <Button>Save Layout</Button>
      </div>
    </div>
  );
}