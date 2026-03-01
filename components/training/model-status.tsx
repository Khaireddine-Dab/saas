"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function ModelStatus() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Model
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>
          </CardTitle>
          <CardDescription>Model v2.4.1</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Accuracy</span>
              <span className="font-medium">92.3%</span>
            </div>
            <Progress value={92.3} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Precision</span>
              <span className="font-medium">89.7%</span>
            </div>
            <Progress value={89.7} className="h-2" />
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-4 h-4" />
            Last trained 2 days ago
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Training Status
            <Badge variant="secondary">In Progress</Badge>
          </CardTitle>
          <CardDescription>Current training session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">65%</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Samples processed</span>
              <span className="font-medium">6,500 / 10,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated time</span>
              <span className="font-medium">~15 minutes</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <AlertCircle className="w-4 h-4" />
            Training in progress
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
