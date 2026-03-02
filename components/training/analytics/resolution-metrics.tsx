"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Resolved", value: 87 },
  { name: "Pending", value: 8 },
  { name: "Escalated", value: 5 },
]

export function ResolutionMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resolution Status</CardTitle>
        <CardDescription>Conversation resolution breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(var(--chart-1))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
