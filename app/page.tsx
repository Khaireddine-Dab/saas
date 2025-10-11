"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Check, Menu, X, Moon, Sun, Star, Zap, Shield, Users, Layers, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { CalendlyModal } from "@/components/calendly-modal"
import { useLanguage } from "@/contexts/language-context"
import { AnimatedLogo } from "@/components/animated-logo"
import { BackendStatus } from "@/components/backend-status"
import { LanguageSelector } from "@/components/language-selector"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [calendlyModalOpen, setCalendlyModalOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const openCalendlyModal = () => {
    setCalendlyModalOpen(true)
  }

  const closeCalendlyModal = () => {
    setCalendlyModalOpen(false)
  }

  const openCalendlyDirect = () => {
    window.open("https://calendly.com/echorift-ai", "_blank", "noopener,noreferrer")
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const features = [
    {
      title: t("feature1Title"),
      description: t("feature1Description"),
      icon: <Users className="size-5" />,
    },
    {
      title: t("feature2Title"),
      description: t("feature2Description"),
      icon: <Zap className="size-5" />,
    },
    {
      title: t("feature3Title"),
      description: t("feature3Description"),
      icon: <Layers className="size-5" />,
    },
    {
      title: t("feature4Title"),
      description: t("feature4Description"),
      icon: <Shield className="size-5" />,
    },
  ]

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"}`}
      >
        <div className="container flex h-16 items-center justify-between">
          <AnimatedLogo 
            size={42} 
            animationType="rotate"
            className="hover:scale-105 transition-transform duration-300"
          />
          <nav className="hidden md:flex gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("features")}
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("pricing")}
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("testimonials")}
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("faq")}
            </Link>
          </nav>
          <div className="hidden md:flex gap-4 items-center">
            <BackendStatus />
            <LanguageSelector />
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("login")}
            </Link>

          </div>
          <div className="flex items-center gap-4 md:hidden">
            <BackendStatus />
            <LanguageSelector />
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b"
          >
            <div className="container py-4 flex flex-col gap-4">
              <Link href="#features" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                {t("features")}
              </Link>
              <Link href="#pricing" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                {t("pricing")}
              </Link>
              <Link href="#testimonials" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                {t("testimonials")}
              </Link>
              <Link href="#faq" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                {t("faq")}
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link href="/login" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                  {t("login")}
                </Link>
                <Button
                  className="rounded-full"
                  onClick={() => {
                    openCalendlyDirect()
                    setMobileMenuOpen(false)
                  }}
                >
                  {t("getStarted")}
                  <ExternalLink className="ml-1 size-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="container px-4 md:px-6 relative">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <Badge className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                {t("badge")}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                {t("heroTitle")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{t("heroDescription")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="rounded-full h-12 px-8 text-base" onClick={openCalendlyDirect}>
                  {t("bookDemo")}
                  <ExternalLink className="ml-2 size-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>{t("noSetupFees")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>{t("hourSetup")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>{t("cancelAnytime")}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-5xl"
            >
              <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20"></div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
              <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                {t("features")}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("featuresTitle")}</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">{t("featuresDescription")}</p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature, i) => (
                <motion.div key={i} variants={item}>
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
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
                {t("pricing")}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("pricingTitle")}</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">{t("pricingDescription")}</p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              {/* Starter Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-lg">
                  <CardContent className="p-8 flex flex-col h-full">
                    <h3 className="text-2xl font-bold mb-2">{t("starterPlan")}</h3>
                    <p className="text-muted-foreground mb-6">{t("starterDescription")}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{t("starterPrice")}</span>
                      <span className="text-muted-foreground">{t("perMonth")}</span>
                    </div>
                    <Button className="w-full rounded-full mb-6">{t("choosePlan")}</Button>
                    <ul className="space-y-3 flex-grow">
                      <li className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{t("starterFeature1")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{t("starterFeature2")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{t("starterFeature3")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{t("starterFeature4")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{t("starterFeature5")}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Professional Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="h-full overflow-hidden border-primary/50 bg-gradient-to-b from-background to-primary/5 backdrop-blur transition-all hover:shadow-xl relative">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {t("mostPopular")}
                  </div>
                  <CardContent className="p-8 flex flex-col h-full">
                    <h3 className="text-2xl font-bold mb-2">{t("professionalPlan")}</h3>
                    <p className="text-muted-foreground mb-6">{t("professionalDescription")}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{t("professionalPrice")}</span>
                      <span className="text-muted-foreground">{t("perMonth")}</span>
                    </div>
                    <Button className="w-full rounded-full mb-6">{t("choosePlan")}</Button>
                    <ul className="space-y-3 flex-grow">
                      <li className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{t("professionalFeature1")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{t("professionalFeature2")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{t("professionalFeature3")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{t("professionalFeature4")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{t("professionalFeature5")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{t("professionalFeature6")}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enterprise Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-lg">
                  <CardContent className="p-8 flex flex-col h-full">
                    <h3 className="text-2xl font-bold mb-2">{t("enterprisePlan")}</h3>
                    <p className="text-muted-foreground mb-6">{t("enterpriseDescription")}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{t("enterprisePrice")}</span>
                    </div>
                    <Button variant="outline" className="w-full rounded-full mb-6 bg-transparent">
                      {t("contactSales")}
                    </Button>
                    <ul className="space-y-3 flex-grow">
                      <li className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{t("enterpriseFeature1")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{t("enterpriseFeature2")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{t("enterpriseFeature3")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{t("enterpriseFeature4")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{t("enterpriseFeature5")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{t("enterpriseFeature6")}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                {t("howItWorks")}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("howItWorksTitle")}</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">{t("howItWorksDescription")}</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0"></div>

              {[
                {
                  step: "01",
                  title: t("step1Title"),
                  description: t("step1Description"),
                },
                {
                  step: "02",
                  title: t("step2Title"),
                  description: t("step2Description"),
                },
                {
                  step: "03",
                  title: t("step3Title"),
                  description: t("step3Description"),
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative z-10 flex flex-col items-center text-center space-y-4"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                {t("testimonials")}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("testimonialsTitle")}</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">{t("testimonialsDescription")}</p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote:
                    "SaaSify has transformed how we manage our projects. The automation features have saved us countless hours of manual work.",
                  author: "Sarah Johnson",
                  role: "Project Manager, TechCorp",
                  rating: 5,
                },
                {
                  quote:
                    "The analytics dashboard provides insights we never had access to before. It's helped us make data-driven decisions that have improved our ROI.",
                  author: "Michael Chen",
                  role: "Marketing Director, GrowthLabs",
                  rating: 5,
                },
                {
                  quote:
                    "Customer support is exceptional. Any time we've had an issue, the team has been quick to respond and resolve it. Couldn't ask for better service.",
                  author: "Emily Rodriguez",
                  role: "Operations Lead, StartupX",
                  rating: 5,
                },
                {
                  quote:
                    "We've tried several similar solutions, but none compare to the ease of use and comprehensive features of SaaSify. It's been a game-changer.",
                  author: "David Kim",
                  role: "CEO, InnovateNow",
                  rating: 5,
                },
                {
                  quote:
                    "The collaboration tools have made remote work so much easier for our team. We're more productive than ever despite being spread across different time zones.",
                  author: "Lisa Patel",
                  role: "HR Director, RemoteFirst",
                  rating: 5,
                },
                {
                  quote: "talkBridge has replaced our receptionist and increased bookings by 60%.",
                  author: "Dr. Sarah Johnson",
                  role: "Local Clinic Owner",
                  rating: 5,
                },
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex mb-4">
                        {Array(testimonial.rating)
                          .fill(0)
                          .map((_, j) => (
                            <Star key={j} className="size-4 text-yellow-500 fill-yellow-500" />
                          ))}
                      </div>
                      <p className="text-lg mb-6 flex-grow">{testimonial.quote}</p>
                      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/40">
                        <div className="size-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium">
                          {testimonial.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                {t("faq")}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("faqTitle")}</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">{t("faqDescription")}</p>
            </motion.div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: t("faq1Question"),
                    answer: t("faq1Answer"),
                  },
                  {
                    question: t("faq2Question"),
                    answer: t("faq2Answer"),
                  },
                  {
                    question: t("faq3Question"),
                    answer: t("faq3Answer"),
                  },
                  {
                    question: t("faq4Question"),
                    answer: t("faq4Answer"),
                  },
                  {
                    question: t("faq5Question"),
                    answer: t("faq5Answer"),
                  },
                  {
                    question: t("faq6Question"),
                    answer: t("faq6Answer"),
                  },
                ].map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <AccordionItem value={`item-${i}`} className="border-b border-border/40 py-2">
                      <AccordionTrigger className="text-left font-medium hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-6 text-center"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">{t("ctaTitle")}</h2>
              <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">{t("ctaDescription")}</p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full h-12 px-8 text-base"
                  onClick={openCalendlyDirect}
                >
                  {t("bookDemo")}
                  <ExternalLink className="ml-2 size-4" />
                </Button>
              </div>
              <div className="text-sm text-primary-foreground/80 mt-4 space-y-1">
                <p>{t("email")}: talkbridge.ai@gmail.com</p>
                <p>{t("phone")}: +216 50704630</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
        <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold">
                <div className="size-8 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="talkBridge Logo"
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <span>talkBridge</span>
              </div>
              <p className="text-sm text-muted-foreground">{t("footerDescription")}</p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">{t("product")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("features")}
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("pricing")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("integrations")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("api")}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">{t("resources")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("documentation")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("guides")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("blog")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("support")}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">{t("company")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("about")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("careers")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("privacyPolicy")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("termsOfService")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} EchoRift. {t("allRightsReserved")}
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {t("privacyPolicy")}
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {t("termsOfService")}
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {t("cookiePolicy")}
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Calendly Modal - Keep as backup option */}
      <CalendlyModal isOpen={calendlyModalOpen} onClose={closeCalendlyModal} />
    </div>
  )
}
