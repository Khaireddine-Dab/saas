import { DashboardLayout } from "@/components/dashboard/layout"
import { SupportHeader } from "@/components/support/support-header"
import { SupportOptions } from "@/components/support/support-options"
import { FAQ } from "@/components/support/faq"
import { SupportTickets } from "@/components/support/support-tickets"

export default function Page() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SupportHeader />
        <SupportOptions />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FAQ />
          <SupportTickets />
        </div>
      </div>
    </DashboardLayout>
  )
}
