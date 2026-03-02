"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, RefreshCw } from "lucide-react"

export function ApiSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your API credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="flex gap-2">
              <Input type="password" value="sk_live_••••••••••••••••" readOnly />
              <Button variant="outline" size="icon">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Created on Oct 15, 2024</p>
          </div>

          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input placeholder="https://your-domain.com/webhooks" />
          </div>

          <div className="flex gap-2">
            <Button>Save API Settings</Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <RefreshCw className="w-4 h-4" />
              Regenerate Key
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Usage</CardTitle>
          <CardDescription>Your API usage this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Requests</span>
              <Badge variant="secondary">45,234 / 100,000</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Tokens</span>
              <Badge variant="secondary">2.4M / 10M</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
