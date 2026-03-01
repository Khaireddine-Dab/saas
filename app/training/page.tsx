import { DashboardLayout } from "@/components/dashboard/layout"
import { TrainingHeader } from "@/components/training/training-header"
import { ModelStatus } from "@/components/training/model-status"
import { KnowledgeBase } from "@/components/training/knowledge-base"
import { TrainingHistory } from "@/components/training/training-history"
import { OptimizationTips } from "@/components/training/optimization-tips"

export default function Page() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <TrainingHeader />
        <ModelStatus />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <KnowledgeBase />
          </div>
          <OptimizationTips />
        </div>
        <TrainingHistory />
      </div>
    </DashboardLayout>
  )
}
