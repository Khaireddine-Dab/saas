"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    trainingAlerts: true,
    errorAlerts: true,
    weeklyReport: false,
  })

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Notification Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Notifications
          </Label>
          <Switch
            id="email"
            checked={settings.emailNotifications}
            onCheckedChange={() => handleToggle("emailNotifications")}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="push" className="text-sm font-medium">
            Push Notifications
          </Label>
          <Switch
            id="push"
            checked={settings.pushNotifications}
            onCheckedChange={() => handleToggle("pushNotifications")}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="training" className="text-sm font-medium">
            Training Alerts
          </Label>
          <Switch
            id="training"
            checked={settings.trainingAlerts}
            onCheckedChange={() => handleToggle("trainingAlerts")}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="errors" className="text-sm font-medium">
            Error Alerts
          </Label>
          <Switch id="errors" checked={settings.errorAlerts} onCheckedChange={() => handleToggle("errorAlerts")} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="weekly" className="text-sm font-medium">
            Weekly Report
          </Label>
          <Switch id="weekly" checked={settings.weeklyReport} onCheckedChange={() => handleToggle("weeklyReport")} />
        </div>
      </CardContent>
    </Card>
  )
}
