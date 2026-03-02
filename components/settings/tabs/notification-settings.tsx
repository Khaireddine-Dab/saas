"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const notifications = [
  {
    id: "email-alerts",
    label: "Email Alerts",
    description: "Receive email notifications for important events",
    enabled: true,
  },
  {
    id: "low-confidence",
    label: "Low Confidence Alerts",
    description: "Notify when AI confidence drops below threshold",
    enabled: true,
  },
  {
    id: "quota-warning",
    label: "Quota Warnings",
    description: "Alert when approaching usage limits",
    enabled: true,
  },
  {
    id: "training-complete",
    label: "Training Complete",
    description: "Notify when model training finishes",
    enabled: false,
  },
  {
    id: "weekly-digest",
    label: "Weekly Digest",
    description: "Receive weekly performance summary",
    enabled: true,
  },
]

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {notifications.map((notif) => (
          <div key={notif.id} className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">{notif.label}</Label>
              <p className="text-sm text-muted-foreground">{notif.description}</p>
            </div>
            <Switch defaultChecked={notif.enabled} />
          </div>
        ))}
        <Button>Save Preferences</Button>
      </CardContent>
    </Card>
  )
}
