"use client"
import { TrendingUp, MessageSquare, Zap, Smile } from "lucide-react"
import { StatCard } from "../components/stat-card"
import { ActivityFeed } from "../components/activity-feed"
import { PlanStatus } from "../components/plan-status"
import { QuickActions } from "../components/quick-actions"

export function HomePage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Good morning, Alex!</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your AI assistant</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Conversations" value="2,847" trend="+12.5%" icon={MessageSquare} color="blue" />
        <StatCard title="AI Resolution Rate" value="87%" trend="+2.3%" icon={Zap} color="green" />
        <StatCard title="Avg Response Time" value="1.2s" trend="-0.3s" icon={TrendingUp} color="purple" />
        <StatCard title="User Satisfaction" value="4.8/5" trend="+0.2" icon={Smile} color="orange" />
        <StatCard title="Cost Savings" value="$12.4K" trend="+$2.1K" icon={TrendingUp} color="emerald" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <QuickActions />
          <PlanStatus />
        </div>
      </div>
    </div>
  )
}
