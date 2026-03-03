import React from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { SidebarNav } from '@/components/dashboard/sidebar-nav';

export const metadata = {
  title: 'Dashboard | Ro2ya Admin Panel',
  description: 'Enterprise admin panel for Ro2ya marketplace',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <SidebarNav />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-64 sm:ml-64">
        {/* Header */}
        <DashboardHeader />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
