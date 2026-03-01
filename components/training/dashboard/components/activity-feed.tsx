import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, AlertCircle, Zap, Gift } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "conversation",
    title: "New conversation from John Doe",
    description: "Asking about shipping options",
    time: "2 minutes ago",
    icon: MessageCircle,
  },
  {
    id: 2,
    type: "alert",
    title: "Low confidence detection",
    description: 'Intent "billing_issue" needs attention',
    time: "15 minutes ago",
    icon: AlertCircle,
  },
  {
    id: 3,
    type: "feature",
    title: "New feature available",
    description: "Sentiment analysis is now enabled",
    time: "1 hour ago",
    icon: Zap,
  },
  {
    id: 4,
    type: "billing",
    title: "Billing alert",
    description: "You've used 80% of your quota",
    time: "3 hours ago",
    icon: Gift,
  },
]

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
        <CardDescription>Recent events and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
