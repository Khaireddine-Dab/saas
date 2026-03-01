"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb } from "lucide-react"

const tips = [
  {
    title: "Add more examples",
    description: "Increase training data for better accuracy",
    priority: "high",
  },
  {
    title: "Review low-confidence intents",
    description: "Improve intent classification",
    priority: "medium",
  },
  {
    title: "Update knowledge base",
    description: "Add recent product changes",
    priority: "medium",
  },
]

export function OptimizationTips() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Optimization Tips
        </CardTitle>
        <CardDescription>Recommendations to improve performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tips.map((tip, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-medium text-sm">{tip.title}</p>
                <Badge variant={tip.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                  {tip.priority}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{tip.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
