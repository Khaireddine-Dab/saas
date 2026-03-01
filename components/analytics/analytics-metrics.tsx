"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

const metrics = [
  {
    label: "Total Conversations",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
  },
  {
    label: "Avg Resolution Time",
    value: "4.2 min",
    change: "-8.3%",
    trend: "down",
  },
  {
    label: "Resolution Rate",
    value: "87%",
    change: "+2.3%",
    trend: "up",
  },
  {
    label: "Customer Satisfaction",
    value: "4.8/5",
    change: "+0.2",
    trend: "up",
  },
]

export function AnalyticsMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="text-2xl font-bold mt-2">{metric.value}</p>
            <div className="flex items-center gap-1 mt-2">
              {metric.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-600" />
              )}
              <span className="text-xs text-green-600">{metric.change}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
