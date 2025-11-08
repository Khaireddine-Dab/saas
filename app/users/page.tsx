"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { UsersHeader } from "@/components/users/users-header"
import { UsersTable } from "@/components/users/users-table"
import { UsersStats } from "@/components/users/users-stats"

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <UsersHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <UsersStats />
        <UsersTable searchQuery={searchQuery} />
      </div>
    </DashboardLayout>
  )
}
