"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, BarChart3, Users, CreditCard, Settings, Bell, LogOut } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"
import { AnimatedLogo } from "@/components/animated-logo"

const navigation = [
  { name: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "users", href: "/dashboard/users", icon: Users },
  { name: "billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "settings", href: "/dashboard/settings", icon: Settings },
  { name: "notifications", href: "/dashboard/notifications", icon: Bell },
]

import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function DashboardSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { language } = useLanguage()
  const t = translations[language]

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    toast.success("Déconnexion réussie")
    router.push("/login")
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard">
          <AnimatedLogo
            size={36}
            animationType="glow"
            showText={false}
            className="hover:scale-105 transition-transform duration-300"
          />
          <span className="ml-2 font-semibold text-lg">talkBridge</span>
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
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {t.logout}
        </Button>
      </div>
    </div>
  )
}
