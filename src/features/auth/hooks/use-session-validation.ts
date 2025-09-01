"use client"

import { useState, useCallback } from "react"
import { ApiEndpoints } from "@/lib/api-endpoints"

export function useSessionValidation() {
  const [isValidating, setIsValidating] = useState(false)

  const validateSession = useCallback(async () => {
    setIsValidating(true)
    try {
      const response = await fetch(ApiEndpoints.backend.validateToken, {
        method: "GET",
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        return { isValid: true, user: data }
      }
      return { isValid: false, user: null }
    } catch (error) {
      console.error("Erro ao validar sessão:", error)
      return { isValid: false, user: null }
    } finally {
      setIsValidating(false)
    }
  }, [])

  const clearSession = useCallback(() => {
    console.log("Sessão limpa.")
  }, [])

  return { validateSession, clearSession, isValidating }
}