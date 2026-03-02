"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { ConversationsTable } from "@/components/conversations/conversations-table"
import { ConversationsHeader } from "@/components/conversations/conversations-header"

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ConversationsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <ConversationsTable searchQuery={searchQuery} />
      </div>
    </DashboardLayout>
  )
}
