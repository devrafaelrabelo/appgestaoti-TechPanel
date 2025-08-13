"use client"

import { useState, useEffect, useCallback } from "react"
import { checkBackendHealth, type BackendHealthStatus } from "@/features/auth/utils/backend-health"

export function useBackendStatus() {
  const [status, setStatus] = useState<BackendHealthStatus>({
    isOnline: false,
    status: "offline",
    message: "Verificando conexão...",
  })
  const [isChecking, setIsChecking] = useState(false)

  const checkStatus = useCallback(async () => {
    setIsChecking(true)
    try {
      const healthStatus = await checkBackendHealth()
      setStatus(healthStatus)
    } catch (error) {
      setStatus({
        isOnline: false,
        status: "error",
        message: "Erro ao verificar status do backend",
      })
    } finally {
      setIsChecking(false)
    }
  }, []) // <- Removido isChecking!

  // Verificação inicial
  useEffect(() => {
    checkStatus()
  }, [checkStatus])

  // Verificação periódica a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      checkStatus()
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [checkStatus])

  // Verificação quando a aba volta ao foco
  useEffect(() => {
    const handleFocus = () => {
      checkStatus()
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [checkStatus])

  return {
    status,
    isChecking,
    checkStatus,
  }
}
