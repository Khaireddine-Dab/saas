"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, BarChart3, Users, CreditCard, Settings, Bell, LogOut } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"

const navigation = [
  { name: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "users", href: "/dashboard/users", icon: Users },
  { name: "billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "settings", href: "/dashboard/settings", icon: Settings },
  { name: "notifications", href: "/dashboard/notifications", icon: Bell },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <LayoutDashboard className="h-6 w-6" />
          <span>EchoRift</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {t[item.name as keyof typeof t]}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
      <div className="border-t p-3">
        <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
          <LogOut className="h-4 w-4" />
          {t.logout}
        </Button>
      </div>
    </div>
  )
}
