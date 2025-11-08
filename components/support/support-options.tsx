"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, BookOpen, Mail, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const options = [
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our support team",
    action: "chat",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us an email",
    action: "email",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Browse our knowledge base",
    action: "docs",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Call our support team",
    action: "phone",
  },
]

export function SupportOptions() {
  const { toast } = useToast()

  const handleSupportClick = (action: string) => {
    const messages: Record<string, string> = {
      chat: "Opening live chat support...",
      email: "Opening email support form...",
      docs: "Redirecting to documentation...",
      phone: "Displaying phone support number...",
    }

    toast({
      title: "Support",
      description: messages[action] || "Processing...",
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {options.map((option) => {
        const Icon = option.icon
        return (
          <Card key={option.title}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleSupportClick(option.action)}
                >
                  {option.title === "Live Chat" && "Start Chat"}
                  {option.title === "Email Support" && "Send Email"}
                  {option.title === "Documentation" && "View Docs"}
                  {option.title === "Phone Support" && "Call Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
