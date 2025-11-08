"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PricingSection() {
  const [messages, setMessages] = useState(2000)
  const [calls, setCalls] = useState(10)

  const calculatePrice = (messageTier: number, callTier: number) => {
    const basePrice = messageTier * 0.001 + callTier * 0.03
    return Math.round(basePrice)
  }

  const getRecommendedPlan = () => {
    // Free Trial: up to 1000 messages and 6000 calls/mo
    if (messages <= 1000 && calls <= 6000) {
      return "Free Trial"
    }
    // Basic: up to 10k messages and 100k calls/mo
    if (messages <= 10000 && calls <= 100000) {
      return "Basic"
    }
    // Advanced: for higher volumes
    return "Advanced"
  }

  const recommendedPlan = getRecommendedPlan()

  const plans = [
    {
      name: "Free Trial",
      price: 0,
      period: "for 60 days",
      description: "send up to 100 messages and response up to 100 calls",
      features: [
        "send up to 100 messages",
        "response up to 100 calls",
        "Basic support",
        "Email templates",
        "Contact management",
      ],
      cta: "Start for free",
      variant: "outline" as const,
      recommended: recommendedPlan === "Free Trial",
    },
    {
      name: `Basic ${Math.round(messages / 1000)}k`,
      price: calculatePrice(messages, calls),
      period: "/mo",
      description: `${(messages / 1000).toFixed(0)}k messages and ${(calls / 1000).toFixed(0)}k calls/mo`,
      features: [
        `${(messages / 1000).toFixed(0)}k messages`,
        `${(calls / 1000).toFixed(0)}k calls/mo`,
        "Priority support",
        "Advanced templates",
        "Analytics dashboard",
      ],
      cta: "Start for free",
      variant: "default" as const,
      recommended: recommendedPlan === "Basic",
    },
    {
      name: `Advanced ${Math.round(messages / 1000)}k`,
      price: calculatePrice(messages * 1.5, calls * 1.5),
      period: "/mo",
      description: `${((messages * 1.5) / 1000).toFixed(0)}k messages and ${((calls * 1.5) / 1000).toFixed(0)}k calls/mo`,
      features: [
        `${((messages * 1.5) / 1000).toFixed(0)}k messages`,
        `${((calls * 1.5) / 1000).toFixed(0)}k calls/mo`,
        "24/7 support",
        "Custom templates",
        "Advanced analytics",
        "API access",
      ],
      cta: "Start for free",
      variant: "default" as const,
      recommended: recommendedPlan === "Advanced",
    },
    {
      name: "Custom",
      price: null,
      period: "Custom pricing",
      description: "Customize your plan for exactly what you need",
      features: [
        "Unlimited messages",
        "Unlimited calls",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
        "White-label options",
      ],
      cta: "Contact sales",
      variant: "outline" as const,
      recommended: false,
    },
  ]

  const messageMarks = [1000, 100000, 200000, 300000, 400000, 500000]
  const callMarks = [10, 8000, 15000, 20000, 30000, 35000, 40000, 50000]

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`
    if (num >= 100) return num
    return num.toString()
  }

  return (
    <section id="pricing" className="w-full py-20 md:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Start for free, then pay as you go</h2>

          <div className="flex items-center gap-1">
            <Check className="size-4 text-success" />
            <p className="max-w-[800px] text-muted-foreground md:text-lg">
              Sign up for free trial. No credit cards required!
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Check className="size-4 text-success" />
            <p className="max-w-[800px] text-muted-foreground md:text-lg">
              Only pay for the volume and features you need.
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Check className="size-4 text-success" />
            <p className="max-w-[800px] text-muted-foreground md:text-lg">Unlock volume discounts as you scale.</p>
          </div>
        </motion.div>

        {/* Sliders Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto mb-16 space-y-12"
        >
          {/* Messages Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">How many messages would you like to send?</h3>
              <span className="text-2xl font-bold text-primary">{formatNumber(messages)}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="500000"
              value={messages}
              onChange={(e) => setMessages(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              {messageMarks.map((mark) => (
                <span key={mark}>{formatNumber(mark)}</span>
              ))}
            </div>
          </div>

          {/* Calls Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">How many calls would you like to respond to per month?</h3>
              <span className="text-2xl font-bold text-primary">{formatNumber(calls)}</span>
            </div>
            <input
              type="range"
              min="10"
              max="50000"
              value={calls}
              onChange={(e) => setCalls(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              {callMarks.map((mark) => (
                <span key={mark}>{formatNumber(mark)}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-4 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`h-full overflow-hidden transition-all hover:shadow-lg relative ${
                  plan.recommended
                    ? "border-green-500/50 bg-gradient-to-b from-background to-green-50/10 dark:to-green-950/10"
                    : "border-border/40 bg-gradient-to-b from-background to-muted/10"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    Recommended
                  </div>
                )}
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                  <div className="mb-6">
                    {plan.price !== null ? (
                      <>
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-muted-foreground text-sm">{plan.period}</span>
                      </>
                    ) : (
                      <span className="text-lg font-semibold text-muted-foreground">{plan.period}</span>
                    )}
                  </div>

                  <Button
                    className="w-full rounded-full mb-6"
                    variant={plan.variant}
                    onClick={() => window.open("https://calendly.com/echorift-ai", "_blank")}
                  >
                    {plan.cta}
                  </Button>

                  <ul className="space-y-3 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="size-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
