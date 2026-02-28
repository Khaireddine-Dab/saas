"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useBackendStatus } from "@/hooks/useBackendStatus"

const backendEnabled = !!process.env.NEXT_PUBLIC_BACKEND_URL

interface BackendStatusProps {
  showDetails?: boolean
  className?: string
}

export function BackendStatus({ showDetails = false, className = "" }: BackendStatusProps) {
  if (!backendEnabled) return null

  const { isConnected, isLoading, error, lastChecked, checkConnection } = useBackendStatus()

  const getStatusIcon = () => {
    if (isLoading) {
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
    }
    if (isConnected) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusText = () => {
    if (isLoading) return "Vérification..."
    if (isConnected) return "Backend connecté"
    return "Backend déconnecté"
  }

  const getStatusColor = () => {
    if (isLoading) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    if (isConnected) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  const formatLastChecked = () => {
    if (!lastChecked) return ""
    const now = new Date()
    const diff = now.getTime() - lastChecked.getTime()
    const seconds = Math.floor(diff / 1000)
    
    if (seconds < 60) return `Il y a ${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `Il y a ${minutes}min`
    const hours = Math.floor(minutes / 60)
    return `Il y a ${hours}h`
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant="outline" className={`flex items-center gap-2 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
      </Badge>

      {!isConnected && (
        <Button
          variant="ghost"
          size="sm"
          onClick={checkConnection}
          disabled={isLoading}
          className="h-6 px-2"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      )}

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-2"
          >
            {lastChecked && (
              <p className="text-xs text-muted-foreground">
                Dernière vérification: {formatLastChecked()}
              </p>
            )}
            
            {error && (
              <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-red-800 dark:text-red-200">Erreur de connexion</p>
                  <p className="text-red-600 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}

            {isConnected && (
              <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 rounded-md">
                <Wifi className="h-4 w-4 text-green-500" />
                <div className="text-sm">
                  <p className="font-medium text-green-800 dark:text-green-200">Connexion établie</p>
                  <p className="text-green-600 dark:text-green-300">
                    Backend Django accessible sur http://localhost:8000
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Composant compact pour la barre de navigation
export function BackendStatusCompact() {
  if (!backendEnabled) return null

  const { isConnected, isLoading, checkConnection } = useBackendStatus()

  return (
    <motion.button
      onClick={checkConnection}
      disabled={isLoading}
      className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-accent transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isLoading ? (
        <RefreshCw className="h-3 w-3 animate-spin text-blue-500" />
      ) : isConnected ? (
        <Wifi className="h-3 w-3 text-green-500" />
      ) : (
        <WifiOff className="h-3 w-3 text-red-500" />
      )}
    </motion.button>
  )
}
