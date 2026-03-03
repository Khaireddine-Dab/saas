'use client';

import React from 'react';
import { Search, Bell, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  userAvatar?: string;
  userName?: string;
}

export function DashboardHeader({
  title = 'Dashboard',
  description,
  userAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  userName = 'Admin User',
}: DashboardHeaderProps) {
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left section - Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />
        </div>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notifications */}
        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>

        {/* User menu */}
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border flex-shrink-0">
            <Image
              src={userAvatar}
              alt={userName}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Settings dropdown trigger (simplified for now) */}
        <Button variant="ghost" size="icon-sm" className="hidden sm:inline-flex">
          <Settings className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </Button>

        {/* Logout */}
        <Button variant="ghost" size="icon-sm">
          <LogOut className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </Button>
      </div>
    </header>
  );
}
