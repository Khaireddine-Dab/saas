"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { KnowledgeBaseHeader } from "@/components/knowledge-base/knowledge-base-header"
import { KnowledgeBaseContent } from "@/components/knowledge-base/knowledge-base-content"
import { KnowledgeBaseStats } from "@/components/knowledge-base/knowledge-base-stats"

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <KnowledgeBaseHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <KnowledgeBaseStats />
        <KnowledgeBaseContent searchQuery={searchQuery} />
      </div>
    </DashboardLayout>
  )
}
