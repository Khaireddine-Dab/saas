'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft, ChevronRight,
  LayoutDashboard, Users, Briefcase, Truck, ShoppingCart,
  Package, Star, Tag, Image as ImageIcon, Shield, Map,
  BarChart3, Settings, MessageCircle, AlertCircle,
  Car, DollarSign, ReceiptText, RefreshCcw, CreditCard,
  Bell, FileText, Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  section?: boolean;
}

// ─── Navigation Structure ─────────────────────────────────────────────────────
const navItems: NavItem[] = [
  { title: 'Dashboard',           href: '/dashboard',                        icon: <LayoutDashboard className="w-4 h-4 text-current" /> },

  { title: 'Platform Management', section: true },
  { title: 'Users',               href: '/dashboard/users',                  icon: <Users className="w-4 h-4 text-current" /> },
  { title: 'Merchants',           href: '/dashboard/merchants',              icon: <Briefcase className="w-4 h-4 text-current" /> },
  { title: 'Drivers',             href: '/dashboard/drivers',                icon: <Truck className="w-4 h-4 text-current" /> },

  { title: 'Commerce', section: true },
  { title: 'Orders',              href: '/dashboard/orders',                 icon: <ShoppingCart className="w-4 h-4 text-current" /> },
  { title: 'Products',            href: '/dashboard/products',               icon: <Package className="w-4 h-4 text-current" /> },
  { title: 'Reviews',             href: '/dashboard/reviews',                icon: <Star className="w-4 h-4 text-current" /> },

  { title: 'Marketing', section: true },
  { title: 'Coupons',             href: '/dashboard/coupons',                icon: <Tag className="w-4 h-4 text-current" /> },
  { title: 'Banners',             href: '/dashboard/banners',                icon: <ImageIcon className="w-4 h-4 text-current" /> },

  { title: 'Operations', section: true },
  { title: 'Fraud Alerts',        href: '/dashboard/fraud',                  icon: <Shield className="w-4 h-4 text-current" /> },
  { title: 'Map',                 href: '/dashboard/map',                    icon: <Map className="w-4 h-4 text-current" /> },
  { title: 'Analytics',           href: '/dashboard/analytics',              icon: <BarChart3 className="w-4 h-4 text-current" /> },

  { title: 'Administration', section: true },
  { title: 'Roles & Permissions', href: '/dashboard/admin/roles',            icon: <Settings className="w-4 h-4 text-current" /> },
  { title: 'Categories',          href: '/dashboard/admin/categories',       icon: <Layers className="w-4 h-4 text-current" /> },
  { title: 'Brands',              href: '/dashboard/admin/brands',           icon: <Briefcase className="w-4 h-4 text-current" /> },
  { title: 'Tax & Discount',      href: '/dashboard/admin/tax-reports',      icon: <ReceiptText className="w-4 h-4 text-current" /> },

  { title: 'Dispatcher', section: true },
  { title: 'Vehicles',            href: '/dashboard/dispatcher/vehicles',    icon: <Car className="w-4 h-4 text-current" /> },
  { title: 'Pricing',             href: '/dashboard/dispatcher/pricing',     icon: <DollarSign className="w-4 h-4 text-current" /> },

  { title: 'Support', section: true },
  { title: 'Support Tickets',     href: '/dashboard/support/tickets',        icon: <AlertCircle className="w-4 h-4 text-current" /> },
  { title: 'Live Chat',           href: '/dashboard/support/chat',           icon: <MessageCircle className="w-4 h-4 text-current" /> },

  { title: 'Payments', section: true },
  { title: 'Transactions',        href: '/dashboard/payments/transactions',  icon: <CreditCard className="w-4 h-4 text-current" /> },
  { title: 'Refunds',             href: '/dashboard/payments/refunds',       icon: <RefreshCcw className="w-4 h-4 text-current" /> },
  { title: 'Subscriptions',       href: '/dashboard/payments/subscriptions', icon: <Tag className="w-4 h-4 text-current" /> },

  { title: 'Reports', section: true },
  { title: 'Sales Reports',       href: '/dashboard/reports/sales',          icon: <BarChart3 className="w-4 h-4 text-current" /> },
  { title: 'Orders Reports',      href: '/dashboard/reports/orders',         icon: <Package className="w-4 h-4 text-current" /> },

  { title: 'Communications', section: true },
  { title: 'Notification Center', href: '/dashboard/notifications',          icon: <Bell className="w-4 h-4 text-current" /> },

  { title: 'Content Management', section: true },
  { title: 'CMS Pages',           href: '/dashboard/cms-pages',              icon: <FileText className="w-4 h-4 text-current" /> },

  { title: 'System', section: true },
  { title: 'Settings',            href: '/dashboard/settings',               icon: <Settings className="w-4 h-4 text-current" /> },
];

// ─── Active Route Helper ──────────────────────────────────────────────────────
function isActiveRoute(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname === href || pathname.startsWith(`${href}/`);
}

// ─── Component ────────────────────────────────────────────────────────────────
export function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex flex-col',
        'bg-card border-r border-border',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* ── Logo Header ── */}
      <div className="h-16 flex items-center justify-between px-3 border-b border-border flex-shrink-0">
        <div className={cn('flex items-center gap-2.5 overflow-hidden', collapsed && 'justify-center w-full')}>
          {/* Logo mark */}
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/30">
            <span className="text-primary-foreground text-sm font-black tracking-tight">R</span>
          </div>
          {/* Brand text */}
          {!collapsed && (
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="text-sm font-bold text-foreground tracking-tight">Ro2ya</span>
              <span className="text-[10px] text-muted-foreground font-medium">Admin Console</span>
            </div>
          )}
        </div>

        {/* Collapse toggle — only visible when expanded */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-colors flex-shrink-0"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <button
            onClick={() => setCollapsed(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <ul className={cn('space-y-0.5', collapsed ? 'px-2' : 'px-3')}>
          {navItems.map((item, idx) => {
            // Section header
            if (item.section) {
              if (collapsed) return null;
              return (
                <li key={`section-${idx}`} className="px-2 pt-5 pb-1.5 first:pt-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 select-none">
                    {item.title}
                  </span>
                </li>
              );
            }

            // Nav link
            const active = isActiveRoute(pathname, item.href!);

            return (
              <li key={item.href}>
                <Link
                  href={item.href!}
                  title={collapsed ? item.title : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 group',
                    collapsed
                      ? 'w-full h-10 justify-center px-0'
                      : 'px-3 py-2.5',
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/70'
                  )}
                >
                  {/* Icon */}
                  <span className={cn(
                    'flex-shrink-0 transition-transform duration-150',
                    !active && 'group-hover:scale-110'
                  )}>
                    {item.icon}
                  </span>

                  {/* Label */}
                  {!collapsed && (
                    <span className="truncate">{item.title}</span>
                  )}

                  {/* Active indicator dot (expanded only) */}
                  {!collapsed && active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground/60 flex-shrink-0" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Footer ── */}
      <div className="flex-shrink-0 border-t border-border px-3 py-3">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-xs font-black">R</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-xs font-black">R</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">Ro2ya Admin</p>
              <p className="text-[10px] text-muted-foreground">v1.0.0</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default SidebarNav;