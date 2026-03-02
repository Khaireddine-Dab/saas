"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralSettings } from "./tabs/general-settings"
import { ApiSettings } from "./tabs/api-settings"
import { NotificationSettings } from "./tabs/notification-settings"
import { SecuritySettings } from "./tabs/security-settings"
import { AccountSettings } from "./tabs/account-settings"

export function SettingsTabs() {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="account" className="space-y-6">
        <AccountSettings />
      </TabsContent>

      {/* Existing code */}
      <TabsContent value="general" className="space-y-6">
        <GeneralSettings />
      </TabsContent>

      <TabsContent value="api" className="space-y-6">
        <ApiSettings />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <NotificationSettings />
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <SecuritySettings />
      </TabsContent>
    </Tabs>
  )
}
