"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Upload } from "lucide-react"
import { useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface KnowledgeBaseHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function KnowledgeBaseHeader({ searchQuery, onSearchChange }: KnowledgeBaseHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const file = files[0]
      const maxSize = 50 * 1024 * 1024 // 50MB
      const allowedTypes = [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Maximum file size is 50MB",
          variant: "destructive",
        })
        return
      }

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Supported formats: PDF, TXT, DOC, DOCX",
          variant: "destructive",
        })
        return
      }

      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Success",
        description: `${file.name} uploaded successfully`,
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">Manage AI training documents and content</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Document
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent" onClick={handleUploadClick} disabled={isUploading}>
            <Upload className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Import"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.txt,.doc,.docx"
          />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search knowledge base..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}
