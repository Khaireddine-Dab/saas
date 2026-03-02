import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function PlanStatus() {
  const used = 1247
  const total = 5000
  const percentage = (used / total) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Plan Status</CardTitle>
        <CardDescription>Professional Plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Conversations</span>
            <span className="font-medium">{percentage.toFixed(1)}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {used.toLocaleString()} / {total.toLocaleString()} conversations
          </p>
        </div>
        <Button className="w-full bg-transparent" variant="outline">
          Upgrade Plan
        </Button>
      </CardContent>
    </Card>
  )
}
