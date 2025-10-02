"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"
import { Bell, CheckCircle2, AlertTriangle, XCircle, User, CreditCard, Settings, TrendingUp } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const notifications = [
  {
    id: 1,
    type: "system",
    title: "System Maintenance Scheduled",
    message: "We will be performing scheduled maintenance on July 15th from 2:00 AM to 4:00 AM UTC.",
    time: "2 hours ago",
    read: false,
    icon: AlertTriangle,
    color: "text-yellow-600",
  },
  {
    id: 2,
    type: "user",
    title: "New User Registration",
    message: "A new user has registered: alice@example.com",
    time: "3 hours ago",
    read: false,
    icon: User,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "billing",
    title: "Payment Successful",
    message: "Your payment of $299.00 has been processed successfully.",
    time: "1 day ago",
    read: true,
    icon: CreditCard,
    color: "text-green-600",
  },
  {
    id: 4,
    type: "system",
    title: "API Rate Limit Warning",
    message: "You have reached 80% of your API rate limit for this month.",
    time: "1 day ago",
    read: true,
    icon: AlertTriangle,
    color: "text-orange-600",
  },
  {
    id: 5,
    type: "user",
    title: "New Feature Available",
    message: "Check out our new analytics dashboard with advanced reporting features.",
    time: "2 days ago",
    read: true,
    icon: TrendingUp,
    color: "text-purple-600",
  },
  {
    id: 6,
    type: "system",
    title: "Security Alert",
    message: "A new login was detected from an unrecognized device.",
    time: "3 days ago",
    read: true,
    icon: XCircle,
    color: "text-red-600",
  },
]

export default function NotificationsPage() {
  const { language } = useLanguage()
  const t = translations[language]
  const [notificationList, setNotificationList] = useState(notifications)
  const [filter, setFilter] = useState("all")

  const unreadCount = notificationList.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotificationList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const filteredNotifications =
    filter === "all"
      ? notificationList
      : filter === "unread"
        ? notificationList.filter((n) => !n.read)
        : notificationList.filter((n) => n.type === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.notifications}</h1>
          <p className="text-muted-foreground">
            You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={markAllAsRead} disabled={unreadCount === 0}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {t.markAllRead}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationList.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationList.filter((n) => n.type === "system").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationList.filter((n) => n.type === "user").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Tabs defaultValue="all" className="space-y-4" onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                {filter === "all"
                  ? "All your notifications"
                  : filter === "unread"
                    ? "Unread notifications"
                    : `${filter.charAt(0).toUpperCase() + filter.slice(1)} notifications`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">{t.noNotifications}</p>
                    <p className="text-sm text-muted-foreground">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-6 hover:bg-muted/50 transition-colors cursor-pointer ${
                          !notification.read ? "bg-muted/30" : ""
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted ${notification.color}`}
                          >
                            <notification.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <p className="font-medium leading-none">{notification.title}</p>
                              {!notification.read && (
                                <Badge variant="default" className="ml-2 bg-blue-600">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
