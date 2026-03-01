"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Trash2, Plus } from "lucide-react"

const documents = [
  { id: 1, name: "Product FAQ", type: "FAQ", size: "2.4 MB", status: "indexed" },
  { id: 2, name: "Support Guidelines", type: "Document", size: "1.8 MB", status: "indexed" },
  { id: 3, name: "Troubleshooting Guide", type: "Guide", size: "3.2 MB", status: "indexing" },
  { id: 4, name: "API Documentation", type: "Documentation", size: "5.1 MB", status: "indexed" },
]

export function KnowledgeBase() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Knowledge Base</CardTitle>
          <CardDescription>Training documents and resources</CardDescription>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Document
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={doc.status === "indexed" ? "default" : "secondary"}>{doc.status}</Badge>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
