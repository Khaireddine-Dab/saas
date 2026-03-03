'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Grid, Users, Briefcase, Package, Star, AlertCircle, Map, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: <Grid className="w-4 h-4" /> },
  { title: 'Users', href: '/dashboard/users', icon: <Users className="w-4 h-4" /> },
  { title: 'Businesses', href: '/dashboard/businesses', icon: <Briefcase className="w-4 h-4" /> },
  { title: 'Products', href: '/dashboard/products', icon: <Package className="w-4 h-4" /> },
  { title: 'Reviews', href: '/dashboard/reviews', icon: <Star className="w-4 h-4" /> },
  { title: 'Reports', href: '/dashboard/reports', icon: <AlertCircle className="w-4 h-4" /> },
  { title: 'Map', href: '/dashboard/map', icon: <Map className="w-4 h-4" /> },
  { title: 'Analytics', href: '/dashboard/analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { title: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-4 h-4" /> },
];

export function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4">
        {!collapsed && <h2 className="text-lg font-bold text-foreground">Ro2ya</h2>}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
              title={collapsed ? item.title : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.title}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="h-16 border-t border-border px-3 flex items-center justify-center">
        <div className="text-xs text-muted-foreground text-center">
          {!collapsed && <p>© 2024 Ro2ya</p>}
        </div>
      </div>
    </aside>
  );
}
