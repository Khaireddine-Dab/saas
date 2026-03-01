"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const history = [
  {
    id: 1,
    version: "v2.4.1",
    date: "2024-10-18",
    duration: "45 min",
    samples: "10,000",
    accuracy: "92.3%",
    status: "completed",
  },
  {
    id: 2,
    version: "v2.4.0",
    date: "2024-10-15",
    duration: "38 min",
    samples: "8,500",
    accuracy: "91.8%",
    status: "completed",
  },
  {
    id: 3,
    version: "v2.3.9",
    date: "2024-10-12",
    duration: "42 min",
    samples: "9,200",
    accuracy: "90.5%",
    status: "completed",
  },
]

export function TrainingHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Training History</CardTitle>
        <CardDescription>Previous model training sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Samples</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.version}</TableCell>
                  <TableCell className="text-sm">{item.date}</TableCell>
                  <TableCell className="text-sm">{item.duration}</TableCell>
                  <TableCell className="text-sm">{item.samples}</TableCell>
                  <TableCell className="text-sm font-medium">{item.accuracy}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
