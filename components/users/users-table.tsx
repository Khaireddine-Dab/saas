"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trash2, Edit2 } from "lucide-react"
import { useState, useMemo } from "react"

const usersData = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Admin",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael@example.com",
    role: "Editor",
    status: "active",
    joinDate: "2024-02-20",
    lastActive: "30 minutes ago",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma@example.com",
    role: "Viewer",
    status: "active",
    joinDate: "2024-03-10",
    lastActive: "1 day ago",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james@example.com",
    role: "Editor",
    status: "inactive",
    joinDate: "2024-04-05",
    lastActive: "2 weeks ago",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa@example.com",
    role: "Admin",
    status: "active",
    joinDate: "2024-01-20",
    lastActive: "5 hours ago",
  },
]

interface UsersTableProps {
  searchQuery: string
}

export function UsersTable({ searchQuery }: UsersTableProps) {
  const [users, setUsers] = useState(usersData)

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users

    const query = searchQuery.toLowerCase()
    return users.filter((u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query))
  }, [users, searchQuery])

  const deleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      Admin: "bg-red-100 text-red-800",
      Editor: "bg-blue-100 text-blue-800",
      Viewer: "bg-gray-100 text-gray-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">User</th>
                <th className="text-left py-3 px-4 font-medium">Email</th>
                <th className="text-left py-3 px-4 font-medium">Role</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Last Active</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{user.lastActive}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          onClick={() => deleteUser(user.id)}
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
                    No users found matching "{searchQuery}"
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
