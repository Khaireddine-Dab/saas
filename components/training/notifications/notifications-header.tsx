"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Trash2 } from "lucide-react"

interface NotificationsHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function NotificationsHeader({ searchQuery, onSearchChange }: NotificationsHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notifications Center</h1>
        <p className="text-muted-foreground mt-1">Manage and view all system notifications</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Trash2 className="w-4 h-4" />
          Clear All
        </Button>
      </div>
    </div>
  )
}
