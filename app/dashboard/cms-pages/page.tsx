'use client';

import { useState } from 'react';
import { Save, X, ChevronLeft, ChevronRight, Bold, Italic, Code2, Link2, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const cmsPages = [
  { id: 1, name: 'Privacy Policy', slug: 'privacy-policy', content: 'Our privacy policy...' },
  { id: 2, name: 'Terms and Conditions', slug: 'terms-conditions', content: 'Terms and conditions...' },
  { id: 3, name: 'User Privacy Policy', slug: 'user-privacy', content: 'User privacy details...' },
  { id: 4, name: 'Merchant Privacy Policy', slug: 'merchant-privacy', content: 'Merchant privacy details...' },
  { id: 5, name: 'About Us', slug: 'about-us', content: 'About our company...' },
];

export default function CMSPagesPage() {
  const [selectedPage, setSelectedPage] = useState(cmsPages[0]);
  const [content, setContent] = useState(selectedPage.content);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      console.log('[v0] Saving CMS page:', selectedPage.name, content);
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manage CMS</h1>
        <p className="text-muted-foreground">Edit static pages and content</p>
      </div>

      {/* Page Tabs */}
      <Card className="p-4 bg-muted border border-border">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="hover:bg-accent">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </Button>

          <div className="flex gap-2 flex-wrap justify-center">
            {cmsPages.map((page) => (
              <button
                key={page.id}
                onClick={() => {
                  setSelectedPage(page);
                  setContent(page.content);
                }}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${selectedPage.id === page.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-accent border border-border'
                  }`}
              >
                {page.name}
              </button>
            ))}
          </div>

          <Button variant="ghost" size="sm" className="hover:bg-accent">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </Card>

      {/* Rich Text Editor */}
      <Card className="space-y-0">
        {/* Toolbar */}
        <div className="p-3 border-b border-border flex flex-wrap gap-1 bg-muted/30">
          <button className="p-2 hover:bg-accent rounded text-foreground transition-colors" title="Bold">
            <Bold className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-accent rounded text-foreground transition-colors" title="Italic">
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-px bg-neutral-200"></div>
          <button className="p-2 hover:bg-neutral-200 rounded" title="Code">
            <Code2 className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-accent rounded text-foreground transition-colors" title="Link">
            <Link2 className="w-4 h-4" />
          </button>
          <div className="w-px bg-border"></div>
          <button className="p-2 hover:bg-accent rounded text-foreground transition-colors" title="Unordered List">
            <List className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-accent rounded text-foreground transition-colors" title="Ordered List">
            <ListOrdered className="w-4 h-4" />
          </button>
          <div className="w-px bg-border"></div>
          <button className="p-2 hover:bg-accent rounded text-foreground transition-colors" title="Align Left">
            <AlignLeft className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-accent rounded text-foreground transition-colors" title="Align Center">
            <AlignCenter className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-accent rounded text-foreground transition-colors" title="Align Right">
            <AlignRight className="w-4 h-4" />
          </button>

          {/* Heading Dropdown */}
          <select className="px-2 py-1 border border-border rounded text-sm bg-background text-foreground">
            <option>Heading</option>
            <option>H1</option>
            <option>H2</option>
            <option>H3</option>
            <option>Paragraph</option>
          </select>
        </div>

        {/* Editor Area */}
        <div className="p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type here..."
            className="w-full h-96 p-4 border border-border bg-background text-foreground rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-between items-center bg-muted/30">
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <X className="w-4 h-4 mr-2" />
              Discard
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Page Info */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Page Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase">Page Name</p>
            <p className="font-semibold">{selectedPage.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">Slug</p>
            <p className="font-mono text-sm">{selectedPage.slug}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">Status</p>
            <p className="font-semibold text-green-500">Published</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">Created</p>
            <p className="text-sm">Jan 15, 2024</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
