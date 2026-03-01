"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Upload, Zap } from "lucide-react"
import { useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function TrainingHeader() {
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
      const maxSize = 100 * 1024 * 1024 // 100MB for training data
      const allowedTypes = [
        "application/pdf",
        "text/plain",
        "text/csv",
        "application/json",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Maximum file size is 100MB",
          variant: "destructive",
        })
        return
      }

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Supported formats: PDF, TXT, CSV, JSON, DOC, DOCX",
          variant: "destructive",
        })
        return
      }

      // Simulate upload and training
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Success",
        description: `${file.name} uploaded. Training will begin shortly.`,
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

  const handleStartTraining = () => {
    toast({
      title: "Training started",
      description: "Your model is now training. This may take several minutes.",
    })
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Training & Optimization</h1>
        <p className="text-muted-foreground mt-1">Improve your AI model performance</p>
      </div>
      <div className="flex gap-2">
        <Button className="gap-2" onClick={handleUploadClick} disabled={isUploading}>
          <Upload className="w-4 h-4" />
          {isUploading ? "Uploading..." : "Upload Training Data"}
        </Button>
        <Button variant="outline" className="gap-2 bg-transparent" onClick={handleStartTraining}>
          <Zap className="w-4 h-4" />
          Start Training
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.txt,.csv,.json,.doc,.docx"
        />
      </div>
    </div>
  )
}
