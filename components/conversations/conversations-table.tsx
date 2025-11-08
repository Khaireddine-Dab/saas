"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, MessageSquare, Clock, User } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMemo } from "react"
import { useToast } from "@/hooks/use-toast"

const conversations = [
  {
    id: "conv-001",
    customer: "John Doe",
    email: "john@example.com",
    subject: "Shipping inquiry",
    status: "resolved",
    messages: 5,
    duration: "12 min",
    date: "2024-10-20",
    satisfaction: 4.5,
  },
  {
    id: "conv-002",
    customer: "Sarah Smith",
    email: "sarah@example.com",
    subject: "Billing issue",
    status: "pending",
    messages: 3,
    duration: "5 min",
    date: "2024-10-20",
    satisfaction: null,
  },
  {
    id: "conv-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    subject: "Product recommendation",
    status: "resolved",
    messages: 8,
    duration: "18 min",
    date: "2024-10-19",
    satisfaction: 5,
  },
  {
    id: "conv-004",
    customer: "Emily Brown",
    email: "emily@example.com",
    subject: "Return request",
    status: "in-progress",
    messages: 4,
    duration: "8 min",
    date: "2024-10-19",
    satisfaction: null,
  },
  {
    id: "conv-005",
    customer: "David Wilson",
    email: "david@example.com",
    subject: "Technical support",
    status: "resolved",
    messages: 12,
    duration: "35 min",
    date: "2024-10-18",
    satisfaction: 4,
  },
]

const statusColors = {
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
}

interface ConversationsTableProps {
  searchQuery: string
}

export function ConversationsTable({ searchQuery }: ConversationsTableProps) {
  const { toast } = useToast()

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations

    const query = searchQuery.toLowerCase()
    return conversations.filter(
      (conv) =>
        conv.customer.toLowerCase().includes(query) ||
        conv.email.toLowerCase().includes(query) ||
        conv.subject.toLowerCase().includes(query),
    )
  }, [searchQuery])

  const handleActionClick = (conversationId: string, action: string) => {
    const messages: Record<string, string> = {
      view: "Opening conversation details...",
      export: "Exporting conversation...",
      delete: "Deleting conversation...",
    }

    toast({
      title: "Action",
      description: messages[action] || "Processing...",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Conversations</CardTitle>
        <CardDescription>View and manage customer conversations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Messages</TableHead>
                <TableHead className="text-center">Duration</TableHead>
                <TableHead className="text-center">Satisfaction</TableHead>
                <TableHead className="text-right">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <TableRow key={conv.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{conv.customer}</p>
                          <p className="text-xs text-muted-foreground">{conv.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm truncate">{conv.subject}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[conv.status as keyof typeof statusColors]}>{conv.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{conv.messages}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{conv.duration}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {conv.satisfaction ? (
                        <span className="text-sm font-medium">{conv.satisfaction}/5</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{conv.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleActionClick(conv.id, "view")}>
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No conversations found matching "{searchQuery}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
