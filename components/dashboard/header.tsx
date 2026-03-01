"use client"

import { Menu, Search, Bell, User, LogOut, Settings, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  onMenuClick: () => void
}

interface Notification {
  id: number
  title: string
  description: string
  time: string
  read: boolean
}

export function Header({ onMenuClick }: HeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: "New conversation", description: "Customer started a new chat", time: "2m ago", read: false },
    {
      id: 2,
      title: "Training completed",
      description: "AI model training finished successfully",
      time: "1h ago",
      read: false,
    },
    { id: 3, title: "System update", description: "Dashboard updated to v2.1.0", time: "5h ago", read: true },
  ])
  const router = useRouter()
  const { toast } = useToast()

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleNotificationClick = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )

    const notification = notifications.find((n) => n.id === notificationId)
    if (notification) {
      toast({
        title: notification.title,
        description: notification.description,
      })
    }
  }

  const handleMarkAllRead = () => {
    const unreadBefore = notifications.filter((n) => !n.read).length
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))

    toast({
      title: "Marked all as read",
      description: `${unreadBefore} notifications marked as read`,
    })
  }

  const handleNavigate = (path: string, label: string) => {
    router.push(path)
    toast({
      title: label,
      description: `Navigating to ${label.toLowerCase()}...`,
    })
  }

  const handleLogout = () => {
    toast({
      title: "Logout",
      description: "You have been logged out successfully",
    })
    // In a real app, this would clear auth and redirect to login
    router.push("/login")
  }

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 gap-4">
      <button onClick={onMenuClick} className="p-2 hover:bg-muted rounded-md transition-colors md:hidden">
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search conversations, users..." className="pl-10" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-muted rounded-md transition-colors relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-muted"
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start gap-2 w-full">
                    {!notification.read && <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center py-2" onClick={handleMarkAllRead}>
              <span className="text-sm font-medium">Mark all as read</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-muted rounded-md transition-colors">
              <Avatar className="w-5 h-5">
                <AvatarImage src="profile_image.jpeg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-1">
              <p className="font-medium">Ahmed Cahrfi</p>
              <p className="text-xs text-muted-foreground">Ahmed_Gas@gmail.com</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleNavigate("/settings", "Profile Settings")}>
                <User className="w-4 h-4 mr-2" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate("/settings", "Account Settings")}>
                <Settings className="w-4 h-4 mr-2" />
                <span>Account Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleNavigate("/support", "Help & Support")}>
                <HelpCircle className="w-4 h-4 mr-2" />
                <span>Help & Support</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
