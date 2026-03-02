"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { date: "Mon", conversations: 240 },
  { date: "Tue", conversations: 320 },
  { date: "Wed", conversations: 280 },
  { date: "Thu", conversations: 390 },
  { date: "Fri", conversations: 450 },
  { date: "Sat", conversations: 380 },
  { date: "Sun", conversations: 420 },
]

export function ConversationTrends() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation Trends</CardTitle>
        <CardDescription>Weekly conversation volume</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="conversations" stroke="hsl(var(--chart-1))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
