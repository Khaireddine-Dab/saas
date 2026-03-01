"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const intents = [
  { name: "Shipping Inquiry", count: 2847, percentage: 28 },
  { name: "Billing Issue", count: 2156, percentage: 21 },
  { name: "Product Info", count: 1923, percentage: 19 },
  { name: "Return Request", count: 1654, percentage: 16 },
  { name: "Technical Support", count: 1420, percentage: 16 },
]

export function TopIntents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customer Intents</CardTitle>
        <CardDescription>Most common conversation topics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {intents.map((intent) => (
            <div key={intent.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{intent.name}</span>
                <Badge variant="secondary">{intent.count.toLocaleString()}</Badge>
              </div>
              <Progress value={intent.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
