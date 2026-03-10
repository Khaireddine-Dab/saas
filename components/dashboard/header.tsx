'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, Search, Plus, Bell, Sun, Moon, LogOut,
  User, Settings, ShieldCheck, Activity,
  Building2, Tag, Megaphone, Send, Star,
  ChevronDown, X, Check, AlertCircle, MessageSquare, UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import Image from 'next/image';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Notification {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

interface DashboardHeaderProps {
  onSidebarToggle?: () => void;
  userAvatar?: string;
  userName?: string;
  userRole?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockNotifications: Notification[] = [
  {
    id: '1',
    icon: Building2,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
    title: 'New business registration',
    desc: 'Café Tunis Central submitted for approval',
    time: '2m ago',
    read: false,
  },
  {
    id: '2',
    icon: AlertCircle,
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/10',
    title: 'User reported a review',
    desc: 'Review #4821 flagged as inappropriate',
    time: '14m ago',
    read: false,
  },
  {
    id: '3',
    icon: MessageSquare,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
    title: 'New review submitted',
    desc: '★★★★☆ review on Le Baroque Restaurant',
    time: '1h ago',
    read: false,
  },
  {
    id: '4',
    icon: UserCheck,
    iconColor: 'text-green-400',
    iconBg: 'bg-green-500/10',
    title: 'New user registered',
    desc: 'yassine.t@gmail.com joined the platform',
    time: '3h ago',
    read: true,
  },
  {
    id: '5',
    icon: ShieldCheck,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10',
    title: 'System alert',
    desc: 'Scheduled backup completed successfully',
    time: '5h ago',
    read: true,
  },
];

const quickActions = [
  { icon: Building2, label: 'Add Business', color: 'text-blue-400' },
  { icon: Tag, label: 'Add Category', color: 'text-emerald-400' },
  { icon: Megaphone, label: 'Create Announcement', color: 'text-amber-400' },
  { icon: Send, label: 'Send Notification', color: 'text-purple-400' },
  { icon: Star, label: 'Feature Business', color: 'text-orange-400' },
];

const profileMenu = [
  { icon: User, label: 'Profile', divider: false },
  { icon: Settings, label: 'Account Settings', divider: false },
  { icon: ShieldCheck, label: 'Security', divider: false },
  { icon: Activity, label: 'Activity Logs', divider: true },
  { icon: LogOut, label: 'Logout', divider: false, danger: true },
];

// ─── Hook: click outside ──────────────────────────────────────────────────────
function useClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

// ─── Component ────────────────────────────────────────────────────────────────
export function DashboardHeader({
  onSidebarToggle,
  userAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  userName = 'Admin User',
  userRole = 'Administrator',
}: DashboardHeaderProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const [createOpen, setCreateOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null!);
  const createRef = useRef<HTMLDivElement>(null!);
  const profileRef = useRef<HTMLDivElement>(null!);
  const searchRef = useRef<HTMLInputElement>(null!);

  useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(createRef, () => setCreateOpen(false));
  useClickOutside(profileRef, () => setProfileOpen(false));

  useEffect(() => { setMounted(true); }, []);

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setSearchValue('');
        searchRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const markAllRead = () =>
    setNotifications(n => n.map(x => ({ ...x, read: true })));

  const markRead = (id: string) =>
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  const isDark = resolvedTheme === 'dark';

  return (
    <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">

      {/* ── LEFT ── */}
      <div className="flex items-center gap-3">
        {/* Sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent shrink-0"
        >
          <Menu className="w-4 h-4" />
        </Button>

        {/* Search */}
        <div className={`relative hidden sm:flex items-center transition-all duration-200 ${searchFocused ? 'w-72' : 'w-56'}`}>
          <Search className="absolute left-3 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search users, businesses..."
            className="w-full bg-muted/60 border border-border/60 rounded-lg pl-9 pr-16 py-1.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring/40 focus:border-ring/40 transition-all"
          />
          {searchValue ? (
            <button
              onClick={() => setSearchValue('')}
              className="absolute right-2 p-0.5 rounded text-muted-foreground hover:text-foreground transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-2.5 flex items-center gap-0.5 pointer-events-none">
              <span className="text-[10px] text-muted-foreground/60 font-medium bg-muted px-1.5 py-0.5 rounded border border-border/50">
                ⌘K
              </span>
            </kbd>
          )}
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="flex items-center gap-1.5 sm:gap-2">

        {/* Mobile search icon */}
        <Button variant="ghost" size="icon" className="sm:hidden h-8 w-8 text-muted-foreground hover:text-foreground">
          <Search className="w-4 h-4" />
        </Button>

        {/* Quick Create */}
        <div ref={createRef} className="relative">
          <Button
            onClick={() => { setCreateOpen(o => !o); setNotifOpen(false); setProfileOpen(false); }}
            size="sm"
            className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold px-3 hidden sm:flex"
          >
            <Plus className="w-3.5 h-3.5" />
            Create
            <ChevronDown className={`w-3 h-3 opacity-70 transition-transform ${createOpen ? 'rotate-180' : ''}`} />
          </Button>
          {/* Mobile create */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setCreateOpen(o => !o); setNotifOpen(false); setProfileOpen(false); }}
            className="sm:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Plus className="w-4 h-4" />
          </Button>

          {createOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-popover border border-border rounded-xl shadow-lg shadow-black/10 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider px-3 pt-1 pb-2">
                Quick Actions
              </p>
              {quickActions.map(({ icon: Icon, label, color }) => (
                <button
                  key={label}
                  onClick={() => setCreateOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg mx-0 transition-colors text-left"
                >
                  <Icon className={`w-4 h-4 ${color} shrink-0`} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setNotifOpen(o => !o); setCreateOpen(false); setProfileOpen(false); }}
            className="h-8 w-8 relative text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[14px] h-[14px] bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-xl shadow-lg shadow-black/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-primary/10 text-primary font-semibold px-1.5 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
                {notifications.map(notif => {
                  const Icon = notif.icon;
                  return (
                    <button
                      key={notif.id}
                      onClick={() => markRead(notif.id)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-accent/60 transition-colors group ${!notif.read ? 'bg-accent/20' : ''}`}
                    >
                      <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${notif.iconBg}`}>
                        <Icon className={`w-4 h-4 ${notif.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold leading-tight ${notif.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{notif.desc}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{notif.time}</p>
                      </div>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-border px-4 py-2.5">
                <button className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            {isDark
              ? <Sun className="w-4 h-4" />
              : <Moon className="w-4 h-4" />
            }
          </Button>
        )}

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-border mx-0.5" />

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); setCreateOpen(false); }}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-accent transition-colors group"
          >
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-border flex-shrink-0">
              <Image
                src={userAvatar}
                alt={userName}
                width={28}
                height={28}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-background" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-foreground leading-tight">{userName}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{userRole}</p>
            </div>
            <ChevronDown className={`hidden sm:block w-3 h-3 text-muted-foreground transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-popover border border-border rounded-xl shadow-lg shadow-black/10 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* User info */}
              <div className="px-3 py-2.5 border-b border-border mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-border flex-shrink-0">
                    <Image src={userAvatar} alt={userName} width={32} height={32} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
                    <p className="text-[10px] text-muted-foreground">{userRole}</p>
                  </div>
                </div>
              </div>

              {profileMenu.map(({ icon: Icon, label, divider, danger }) => (
                <React.Fragment key={label}>
                  {divider && <div className="my-1 border-t border-border" />}
                  <button
                    onClick={() => setProfileOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-left mx-0 ${
                      danger
                        ? 'text-destructive hover:bg-destructive/10'
                        : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 opacity-70" />
                    {label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;