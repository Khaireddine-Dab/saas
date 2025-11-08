"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for getting started",
    conversations: "1,000",
    features: ["Basic analytics", "Email support", "API access"],
    current: false,
  },
  {
    name: "Professional",
    price: "$99",
    description: "Most popular for growing teams",
    conversations: "5,000",
    features: ["Advanced analytics", "Priority support", "Custom integrations", "Team management"],
    current: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale operations",
    conversations: "Unlimited",
    features: ["Unlimited conversations", "Dedicated support", "Custom SLA", "On-premise option"],
    current: false,
  },
]

export function PricingPlans() {
  const { toast } = useToast()

  const handlePlanClick = (planName: string, isCurrent: boolean) => {
    if (isCurrent) {
      toast({
        title: "Current Plan",
        description: `You are already on the ${planName} plan`,
      })
    } else {
      toast({
        title: "Upgrade to " + planName,
        description: `Upgrading to ${planName} plan...`,
      })
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upgrade Your Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.current ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                {plan.current && <Badge>Current</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-3xl font-bold">{plan.price}</p>
                <p className="text-sm text-muted-foreground">/month</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Conversations/month</p>
                <p className="text-lg font-semibold">{plan.conversations}</p>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.current ? "outline" : "default"}
                onClick={() => handlePlanClick(plan.name, plan.current)}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
