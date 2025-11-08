import { DashboardLayout } from "@/components/dashboard/layout"
import { BillingHeader } from "@/components/billing/billing-header"
import { CurrentPlan } from "@/components/billing/current-plan"
import { PricingPlans } from "@/components/billing/pricing-plans"
import { BillingHistory } from "@/components/billing/billing-history"

export default function Page() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <BillingHeader />
        <CurrentPlan />
        <PricingPlans />
        <BillingHistory />
      </div>
    </DashboardLayout>
  )
}
