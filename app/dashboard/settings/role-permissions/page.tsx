'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

const roles = ['Admin', 'Moderator', 'Analyst'] as const;
type Role = typeof roles[number];

const permissions = [
  'View Dashboard',
  'Manage Users',
  'Moderate Content',
  'Manage Reports',
  'Generate Analytics',
  'Configure Settings',
  'Manage Admins',
  'View Logs',
  'Export Data',
];

// Default permissions per role
const defaults: Record<Role, string[]> = {
  Admin: permissions, // all
  Moderator: ['View Dashboard', 'Manage Users', 'Moderate Content', 'Manage Reports', 'View Logs'],
  Analyst: ['View Dashboard', 'Generate Analytics', 'View Logs', 'Export Data'],
};

const roleColors: Record<Role, { badge: string; dot: string }> = {
  Admin:     { badge: 'bg-red-500/10 text-red-500 border-red-500/20',    dot: 'bg-red-500' },
  Moderator: { badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20', dot: 'bg-blue-500' },
  Analyst:   { badge: 'bg-green-500/10 text-green-500 border-green-500/20', dot: 'bg-green-500' },
};

export default function RolePermissionsPage() {
  const [perms, setPerms] = useState<Record<Role, Set<string>>>(
    Object.fromEntries(roles.map(r => [r, new Set(defaults[r])])) as Record<Role, Set<string>>
  );

  const toggle = (role: Role, perm: string) => {
    setPerms(prev => {
      const next = new Set(prev[role]);
      next.has(perm) ? next.delete(perm) : next.add(perm);
      return { ...prev, [role]: next };
    });
  };

  const toggleAll = (role: Role, all: boolean) => {
    setPerms(prev => ({
      ...prev,
      [role]: all ? new Set(permissions) : new Set(),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Role Permissions</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure what each admin role can access and manage on the platform.
        </p>
      </div>

      <div className="space-y-4">
        {roles.map(role => {
          const rolePerms = perms[role];
          const allChecked = rolePerms.size === permissions.length;
          const someChecked = rolePerms.size > 0 && !allChecked;
          const { badge, dot } = roleColors[role];

          return (
            <div key={role} className="border border-border rounded-xl overflow-hidden">
              {/* Role Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-muted/20 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">{role}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge}`}>
                    {rolePerms.size}/{permissions.length} permissions
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleAll(role, !allChecked)}
                    className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    {allChecked ? 'Deselect all' : 'Select all'}
                  </button>
                </div>
              </div>

              {/* Permissions Grid */}
              <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {permissions.map(perm => {
                  const checked = rolePerms.has(perm);
                  return (
                    <label
                      key={perm}
                      className={`flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg border transition-all ${
                        checked
                          ? 'border-primary/30 bg-primary/5'
                          : 'border-border bg-card hover:border-border/80 hover:bg-muted/30'
                      }`}
                    >
                      {/* Custom checkbox */}
                      <div
                        onClick={() => toggle(role, perm)}
                        className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all cursor-pointer ${
                          checked ? 'bg-primary border-primary' : 'border-muted-foreground/40 bg-background'
                        }`}
                      >
                        {checked && (
                          <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 10 10">
                            <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span
                        onClick={() => toggle(role, perm)}
                        className={`text-xs font-medium transition-colors ${checked ? 'text-foreground' : 'text-muted-foreground'}`}
                      >
                        {perm}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Discard</Button>
        <Button>Save Permissions</Button>
      </div>
    </div>
  );
}