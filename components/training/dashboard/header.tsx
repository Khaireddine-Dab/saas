"use client"

import { Menu, Search, Bell, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const { toast } = useToast()

  const handleNotificationClick = () => {
    setNotificationOpen(!notificationOpen)
    toast({
      title: "Notifications",
      description: "You have 3 new notifications",
    })
  }

  const handleProfileClick = () => {
    toast({
      title: "Profile",
      description: "Opening user profile settings...",
    })
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
        <button onClick={handleNotificationClick} className="p-2 hover:bg-muted rounded-md transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>
        <button onClick={handleProfileClick} className="p-2 hover:bg-muted rounded-md transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
