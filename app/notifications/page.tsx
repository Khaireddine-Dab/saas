"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { NotificationsHeader } from "@/components/notifications/notifications-header"
import { NotificationsList } from "@/components/notifications/notifications-list"
import { NotificationSettings } from "@/components/notifications/notification-settings"

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <NotificationsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <NotificationsList searchQuery={searchQuery} />
          </div>
          <div>
            <NotificationSettings />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
