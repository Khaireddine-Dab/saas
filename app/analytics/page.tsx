import { DashboardLayout } from "@/components/dashboard/layout"
import { AnalyticsHeader } from "@/components/analytics/analytics-header"
import { AnalyticsMetrics } from "@/components/analytics/analytics-metrics"
import { ConversationTrends } from "@/components/analytics/conversation-trends"
import { ResolutionMetrics } from "@/components/analytics/resolution-metrics"
import { TopIntents } from "@/components/analytics/top-intents"

export default function Page() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AnalyticsHeader />
        <AnalyticsMetrics />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConversationTrends />
          <ResolutionMetrics />
        </div>
        <TopIntents />
      </div>
    </DashboardLayout>
  )
}
