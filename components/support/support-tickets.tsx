"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const tickets = [
  {
    id: "TKT-001",
    subject: "API integration issue",
    status: "open",
    created: "Oct 18, 2024",
    updated: "Oct 20, 2024",
  },
  {
    id: "TKT-002",
    subject: "Feature request: Export to PDF",
    status: "in-progress",
    created: "Oct 15, 2024",
    updated: "Oct 19, 2024",
  },
  {
    id: "TKT-003",
    subject: "Billing inquiry",
    status: "resolved",
    created: "Oct 10, 2024",
    updated: "Oct 12, 2024",
  },
]

const statusColors = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

export function SupportTickets() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>Your support requests</CardDescription>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          New Ticket
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground">{ticket.id}</p>
                </div>
                <Badge className={statusColors[ticket.status as keyof typeof statusColors]}>{ticket.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Updated {ticket.updated}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
