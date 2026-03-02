"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Brain,
  Users,
  BookOpen,
  Settings,
  CreditCard,
  HelpCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/training", label: "AI Training", icon: Brain },
  { href: "/users", label: "Users", icon: Users },
  { href: "/knowledge-base", label: "Knowledge Base", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/support", label: "Support", icon: HelpCircle },
  { href: "/notifications", label: "Notifications", icon: Bell },
]

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        open ? "w-64" : "w-20",
      )}
    >
      {/* Logo */}
      <div className="h-16 border-b border-sidebar-border flex items-center justify-between px-4">
        {open && <span className="font-bold text-lg text-sidebar-foreground">ChatAI</span>}
        <button onClick={onToggle} className="p-1 hover:bg-sidebar-accent rounded-md transition-colors">
          {open ? (
            <ChevronLeft className="w-5 h-5 text-sidebar-foreground" />
          ) : (
            <ChevronRight className="w-5 h-5 text-sidebar-foreground" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent",
                  )}
                  title={!open ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {open && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        {open && (
          <div className="text-xs text-sidebar-foreground/60">
            <p className="font-semibold mb-1">Pro Plan</p>
            <p>1,247 / 5,000 conversations</p>
          </div>
        )}
      </div>
    </aside>
  )
}
