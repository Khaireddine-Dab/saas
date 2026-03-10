'use client';

import { useState } from 'react';
import { FileText, LayoutDashboard, UserPlus, Puzzle, Bell, Info, ChevronRight } from 'lucide-react';

import ProjectDetailsPage from './project-details/page';
import ProjectDocumentsPage from './project-documents/page';
import HomeLayoutPage from './home-layout/page';
import SignupMethodPage from './signup-method/page';
import PluginsPage from './plugins/page';
import StatusConfigurationPage from './status-configuration/page';

type SubSection = 'project-details' | 'project-documents' | 'home-layout' | 'signup-method' | 'plugins' | 'status-configuration';

const navItems: { id: SubSection; label: string; icon: any; description: string }[] = [
  { id: 'project-details',      label: 'Project Details',     icon: Info,            description: 'Branding & general info' },
  { id: 'project-documents',    label: 'Project Documents',   icon: FileText,        description: 'Legal docs & policies' },
  { id: 'home-layout',          label: 'Home Layout',         icon: LayoutDashboard, description: 'Section ordering' },
  { id: 'signup-method',        label: 'Sign Up Method',      icon: UserPlus,        description: 'Auth & social login' },
  { id: 'plugins',              label: 'Plugins',             icon: Puzzle,          description: 'Gateways & services' },
  { id: 'status-configuration', label: 'Status Configuration',icon: Bell,            description: 'Notifications per status' },
];

const contentMap: Record<SubSection, React.ReactNode> = {
  'project-details':      <ProjectDetailsPage />,
  'project-documents':    <ProjectDocumentsPage />,
  'home-layout':          <HomeLayoutPage />,
  'signup-method':        <SignupMethodPage />,
  'plugins':              <PluginsPage />,
  'status-configuration': <StatusConfigurationPage />,
};

export default function SettingsPage() {
  const [active, setActive] = useState<SubSection>('project-details');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure platform features, integrations, and policies
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 space-y-1 bg-card border border-border rounded-xl p-2">
          {navItems.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all group ${
                active === id ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                active === id ? 'bg-primary/20' : 'bg-muted group-hover:bg-muted-foreground/10'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium truncate ${active === id ? 'text-primary' : 'text-foreground'}`}>
                  {label}
                </p>
                <p className="text-xs text-muted-foreground truncate">{description}</p>
              </div>
              {active === id && <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div className="flex-1 min-w-0 bg-card border border-border rounded-xl p-6">
          {contentMap[active]}
        </div>
      </div>
    </div>
  );
}