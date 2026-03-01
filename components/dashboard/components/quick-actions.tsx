"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Eye, AlertCircle, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const actions = [
  { icon: Play, label: "Test Widget", action: "test" },
  { icon: Eye, label: "Live Conversations", action: "live" },
  { icon: AlertCircle, label: "Knowledge Gaps", action: "gaps" },
  { icon: TrendingUp, label: "Upgrade Plan", action: "upgrade" },
]

export function QuickActions() {
  const { toast } = useToast()

  const handleAction = (action: string) => {
    const messages: Record<string, string> = {
      test: "Opening widget test environment...",
      live: "Loading live conversations...",
      gaps: "Analyzing knowledge gaps...",
      upgrade: "Redirecting to upgrade page...",
    }

    toast({
      title: "Action",
      description: messages[action] || "Processing...",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.label}
                variant="outline"
                className="w-full justify-start gap-2 bg-transparent"
                onClick={() => handleAction(action.action)}
              >
                <Icon className="w-4 h-4" />
                {action.label}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
