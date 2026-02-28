"use client"

import { useState, useEffect } from 'react'

interface BackendStatus {
  isConnected: boolean
  isLoading: boolean
  error: string | null
  lastChecked: Date | null
}

export function useBackendStatus() {
  const [status, setStatus] = useState<BackendStatus>({
    isConnected: false,
    isLoading: true,
    error: null,
    lastChecked: null
  })

  const checkBackendConnection = async () => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // Essayer de se connecter à l'endpoint des plans (accessible sans authentification)
      const response = await fetch('http://localhost:8000/api/users/list/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Timeout après 5 secondes
        signal: AbortSignal.timeout(5000)
      })

      if (response.ok) {
        setStatus({
          isConnected: true,
          isLoading: false,
          error: null,
          lastChecked: new Date()
        })
      } else {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
    } catch (error) {
      let errorMessage = 'Backend non accessible'
      
      if (error instanceof Error) {
        if (error.name === 'TimeoutError') {
          errorMessage = 'Timeout: Le backend met trop de temps à répondre'
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Impossible de se connecter au backend (serveur arrêté?)'
        } else {
          errorMessage = error.message
        }
      }

      setStatus({
        isConnected: false,
        isLoading: false,
        error: errorMessage,
        lastChecked: new Date()
      })
    }
  }

  useEffect(() => {
    checkBackendConnection()
    
    // Vérifier la connexion toutes les 30 secondes
    const interval = setInterval(checkBackendConnection, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    ...status,
    checkConnection: checkBackendConnection
  }
}
