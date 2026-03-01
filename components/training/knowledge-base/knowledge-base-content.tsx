"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Trash2, Edit2 } from "lucide-react"
import { useState, useMemo } from "react"

const documentsData = [
  {
    id: 1,
    title: "Product Features Guide",
    category: "Documentation",
    size: "2.4 MB",
    uploadedDate: "2024-10-15",
    relevance: 95,
    status: "active",
  },
  {
    id: 2,
    title: "Customer FAQ",
    category: "FAQ",
    size: "1.8 MB",
    uploadedDate: "2024-10-14",
    relevance: 88,
    status: "active",
  },
  {
    id: 3,
    title: "API Documentation",
    category: "Technical",
    size: "3.2 MB",
    uploadedDate: "2024-10-12",
    relevance: 92,
    status: "active",
  },
  {
    id: 4,
    title: "Troubleshooting Guide",
    category: "Support",
    size: "1.5 MB",
    uploadedDate: "2024-10-10",
    relevance: 85,
    status: "active",
  },
  {
    id: 5,
    title: "Best Practices",
    category: "Training",
    size: "2.1 MB",
    uploadedDate: "2024-10-08",
    relevance: 78,
    status: "archived",
  },
]

interface KnowledgeBaseContentProps {
  searchQuery: string
}

export function KnowledgeBaseContent({ searchQuery }: KnowledgeBaseContentProps) {
  const [documents, setDocuments] = useState(documentsData)

  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents

    const query = searchQuery.toLowerCase()
    return documents.filter((d) => d.title.toLowerCase().includes(query) || d.category.toLowerCase().includes(query))
  }, [documents, searchQuery])

  const deleteDocument = (id: number) => {
    setDocuments(documents.filter((d) => d.id !== id))
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Documentation: "bg-blue-100 text-blue-800",
      FAQ: "bg-green-100 text-green-800",
      Technical: "bg-purple-100 text-purple-800",
      Support: "bg-orange-100 text-orange-800",
      Training: "bg-pink-100 text-pink-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Document</th>
                <th className="text-left py-3 px-4 font-medium">Category</th>
                <th className="text-left py-3 px-4 font-medium">Size</th>
                <th className="text-left py-3 px-4 font-medium">Relevance</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="border-b hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">{doc.uploadedDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getCategoryColor(doc.category)}>{doc.category}</Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{doc.size}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${doc.relevance}%` }} />
                        </div>
                        <span className="text-sm font-medium">{doc.relevance}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={doc.status === "active" ? "default" : "secondary"}>{doc.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          onClick={() => deleteDocument(doc.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    No documents found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
