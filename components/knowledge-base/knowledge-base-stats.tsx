"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, Users, TrendingUp, Clock } from "lucide-react"

const stats = [
  {
    label: "Total Documents",
    value: "1,247",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    label: "Active Users",
    value: "3,421",
    icon: Users,
    color: "text-green-500",
  },
  {
    label: "Avg. Relevance",
    value: "92.3%",
    icon: TrendingUp,
    color: "text-purple-500",
  },
  {
    label: "Last Updated",
    value: "2 hours ago",
    icon: Clock,
    color: "text-orange-500",
  },
]

export function KnowledgeBaseStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
