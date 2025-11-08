"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function CurrentPlan() {
  const { toast } = useToast()

  const handleUpgradeClick = () => {
    toast({
      title: "Upgrade Plan",
      description: "Redirecting to upgrade page...",
    })
  }

  const handleManageSubscriptionClick = () => {
    toast({
      title: "Manage Subscription",
      description: "Opening subscription management...",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Professional Plan</CardDescription>
          </div>
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Conversations Used</span>
            <span className="text-sm text-muted-foreground">1,247 / 5,000</span>
          </div>
          <Progress value={24.94} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Monthly Cost</p>
            <p className="text-2xl font-bold">$99</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Renewal Date</p>
            <p className="text-2xl font-bold">Nov 20</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Plan Features</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Up to 5,000 conversations/month
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Advanced analytics
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Priority support
            </li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleUpgradeClick}>Upgrade Plan</Button>
          <Button variant="outline" className="bg-transparent" onClick={handleManageSubscriptionClick}>
            Manage Subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
