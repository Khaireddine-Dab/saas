"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Bell, AlertCircle, CheckCircle, Info } from "lucide-react"
import { useState, useMemo } from "react"

const notificationsData = [
  {
    id: 1,
    type: "success",
    title: "Model Training Complete",
    message: "Your AI model has finished training with 94.2% accuracy",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "High Error Rate Detected",
    message: "Error rate has increased to 5.2% in the last hour",
    timestamp: "4 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "New Feature Available",
    message: "Check out our new conversation analytics dashboard",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: 4,
    type: "alert",
    title: "API Rate Limit Warning",
    message: "You're approaching your monthly API rate limit",
    timestamp: "2 days ago",
    read: true,
  },
  {
    id: 5,
    type: "success",
    title: "Backup Completed",
    message: "Your data backup has been successfully completed",
    timestamp: "3 days ago",
    read: true,
  },
]

interface NotificationsListProps {
  searchQuery: string
}

export function NotificationsList({ searchQuery }: NotificationsListProps) {
  const [notifications, setNotifications] = useState(notificationsData)

  const filteredNotifications = useMemo(() => {
    if (!searchQuery.trim()) return notifications

    const query = searchQuery.toLowerCase()
    return notifications.filter((n) => n.title.toLowerCase().includes(query) || n.message.toLowerCase().includes(query))
  }, [notifications, searchQuery])

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground">
                {notifications.length === 0 ? "No notifications" : `No notifications matching "${searchQuery}"`}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex gap-3 p-3 rounded-lg border transition-colors ${
                  notification.read ? "bg-background" : "bg-accent/50 border-accent"
                }`}
              >
                <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 flex-shrink-0"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
