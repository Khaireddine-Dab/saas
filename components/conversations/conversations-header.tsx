"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ConversationsHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function ConversationsHeader({ searchQuery, onSearchChange }: ConversationsHeaderProps) {
  const { toast } = useToast()

  const handleFilterClick = () => {
    toast({
      title: "Filter Conversations",
      description: "Opening filter options...",
    })
  }

  const handleExportClick = () => {
    toast({
      title: "Export Conversations",
      description: "Generating export file...",
    })
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Conversations exported successfully",
      })
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Conversations</h1>
        <p className="text-muted-foreground mt-1">Manage and review all customer conversations</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 bg-transparent" onClick={handleFilterClick}>
          <Filter className="w-4 h-4" />
          Filter
        </Button>
        <Button variant="outline" className="gap-2 bg-transparent" onClick={handleExportClick}>
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
    </div>
  )
}
