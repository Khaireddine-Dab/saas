'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const documents = [
  { id: 'terms', label: 'Terms & Conditions', required: true },
  { id: 'privacy', label: 'Privacy Policy', required: true },
  { id: 'refund', label: 'Refund Policy', required: false },
  { id: 'shipping', label: 'Shipping Policy', required: false },
  { id: 'cookie', label: 'Cookie Policy', required: false },
  { id: 'disclaimer', label: 'Disclaimer', required: false },
];

export default function ProjectDocumentsPage() {
  const [docs, setDocs] = useState<Record<string, string>>(
    Object.fromEntries(documents.map(d => [d.id, '']))
  );
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(documents.map(d => [d.id, d.required]))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Project Documents</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage legal documents and policies shown to users on the platform.
        </p>
      </div>

      <div className="space-y-4">
        {documents.map(doc => (
          <div key={doc.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground text-sm">{doc.label}</span>
                {doc.required && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    Required
                  </span>
                )}
              </div>
              <button
                onClick={() => setEnabled(e => ({ ...e, [doc.id]: !e[doc.id] }))}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  enabled[doc.id] ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                  enabled[doc.id] ? 'translate-x-4' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            {enabled[doc.id] && (
              <textarea
                value={docs[doc.id]}
                onChange={e => setDocs(d => ({ ...d, [doc.id]: e.target.value }))}
                placeholder={`Enter ${doc.label} content or paste URL...`}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none min-h-[100px]"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Discard</Button>
        <Button>Save Documents</Button>
      </div>
    </div>
  );
}