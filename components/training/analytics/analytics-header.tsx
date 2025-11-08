"use client"

import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export function AnalyticsHeader() {
  const { toast } = useToast()
  const [dateRange, setDateRange] = useState("last-30-days")

  const handleDateRangeClick = () => {
    toast({
      title: "Date Range",
      description: "Select a date range to filter analytics",
    })
  }

  const handleExportClick = () => {
    toast({
      title: "Export Report",
      description: "Generating and downloading report...",
    })
    // Simulate export
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Report downloaded successfully",
      })
    }, 1500)
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
        <p className="text-muted-foreground mt-1">Track performance and insights</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2 bg-transparent" onClick={handleDateRangeClick}>
          <Calendar className="w-4 h-4" />
          Date Range
        </Button>
        <Button variant="outline" className="gap-2 bg-transparent" onClick={handleExportClick}>
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>
    </div>
  )
}
