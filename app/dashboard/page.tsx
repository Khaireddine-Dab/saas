"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Check, X, Store, User, Mail, Hash, Loader2 } from "lucide-react"
import { storesApi } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardPage() {
  const [stores, setStores] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    setIsLoading(true)
    try {
      const data = await storesApi.getPending()
      setStores(data)
    } catch (error: any) {
      toast.error("Erreur lors de la récupération des boutiques")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async (id: number, action: 'validate' | 'reject') => {
    setActionLoading(id)
    try {
      if (action === 'validate') {
        await storesApi.validate(id)
        toast.success("Boutique validée !")
      } else {
        await storesApi.reject(id)
        toast.success("Boutique rejetée et supprimée.")
      }
      // Rafraîchir la liste
      setStores(prev => prev.filter(s => s.id !== id))
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setActionLoading(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vérification Stores</h1>
          <p className="text-muted-foreground">Gérez les demandes d'ouverture de boutique en attente</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          {stores.length} en attente
        </Badge>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {stores.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl bg-background/50"
            >
              <Store className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground font-medium">Aucune boutique en attente de vérification</p>
            </motion.div>
          ) : (
            stores.map((store) => (
              <motion.div
                key={store.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border-border/40 hover:border-primary/20 transition-colors bg-background/95 backdrop-blur">
                  <CardHeader className="bg-muted/30 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Store className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl uppercase">{store.name}</CardTitle>
                          <p className="text-sm text-muted-foreground capitalize">{store.city}, {store.address}</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">PENDING</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">RNE:</span>
                          <span className="font-mono bg-muted px-2 py-0.5 rounded">{store.rne || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Store className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">Catégorie:</span>
                          <span>{store.category || 'Standard'}</span>
                        </div>
                      </div>

                      <div className="space-y-3 border-x border-border/40 px-6">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">Propriétaire:</span>
                          <span>{store.owner_details?.full_name || 'Inconnu'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">Email:</span>
                          <span className="truncate">{store.owner_details?.email || store.email}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 px-2">
                        <Button
                          variant="outline"
                          className="flex-1 max-w-[120px] rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                          onClick={() => handleAction(store.id, 'reject')}
                          disabled={actionLoading === store.id}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Rejeter
                        </Button>
                        <Button
                          className="flex-1 max-w-[120px] rounded-full"
                          onClick={() => handleAction(store.id, 'validate')}
                          disabled={actionLoading === store.id}
                        >
                          {actionLoading === store.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Valider
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
