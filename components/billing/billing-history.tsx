"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download } from "lucide-react"

const invoices = [
  {
    id: "INV-2024-10",
    date: "Oct 20, 2024",
    amount: "$99.00",
    status: "paid",
    description: "Professional Plan",
  },
  {
    id: "INV-2024-09",
    date: "Sep 20, 2024",
    amount: "$99.00",
    status: "paid",
    description: "Professional Plan",
  },
  {
    id: "INV-2024-08",
    date: "Aug 20, 2024",
    amount: "$99.00",
    status: "paid",
    description: "Professional Plan",
  },
]

export function BillingHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>Your recent invoices and payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell className="text-sm">{invoice.date}</TableCell>
                  <TableCell className="text-sm">{invoice.description}</TableCell>
                  <TableCell className="font-medium">{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
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
