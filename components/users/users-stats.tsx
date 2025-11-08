"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, UserX, Shield } from "lucide-react"

const stats = [
  {
    label: "Total Users",
    value: "248",
    icon: Users,
    color: "text-blue-500",
  },
  {
    label: "Active Users",
    value: "198",
    icon: UserCheck,
    color: "text-green-500",
  },
  {
    label: "Inactive Users",
    value: "50",
    icon: UserX,
    color: "text-red-500",
  },
  {
    label: "Admins",
    value: "12",
    icon: Shield,
    color: "text-purple-500",
  },
]

export function UsersStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
