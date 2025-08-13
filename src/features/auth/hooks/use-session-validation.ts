"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { ApiEndpoints } from "@/lib/api-endpoints"

interface SessionValidationResult {
  isValid: boolean
  user: any | null // O tipo 'any' deve ser substituído por um tipo de usuário mais específico se possível
  error: string | null
}

interface UseSessionValidationReturn {
  isValidating: boolean
  sessionData: SessionValidationResult | null
  validateSession: () => Promise<SessionValidationResult>
  clearSession: () => void
}

export function useSessionValidation(): UseSessionValidationReturn {
  const [isValidating, setIsValidating] = useState(false)
  const [sessionData, setSessionData] = useState<SessionValidationResult | null>(null)
  const lastValidationRef = useRef<number>(0)
  const cacheTimeoutRef = useRef<NodeJS.Timeout>()

  const CACHE_TTL = 1500 * 1000 // Cache TTL de 30 segundos

  const validateSession = useCallback(async (): Promise<SessionValidationResult> => {
    const now = Date.now()

    if (sessionData && now - lastValidationRef.current < CACHE_TTL) {
      console.log("🔄 useSessionValidation: Usando cache da validação de sessão.")
      return sessionData
    }

    if (!process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL.includes("localhost:3000/api")) {
      // Se a URL base não estiver configurada para uma API externa, ou ainda aponta para API routes locais
      // que não existem para /auth/session, retorne um erro ou um estado padrão.
      console.warn(
        "⚠️ useSessionValidation: API_BASE_URL não configurada para API externa ou aponta para API routes locais. Simulação de sessão inválida.",
      )
      const result: SessionValidationResult = {
        isValid: false,
        user: null,
        error: "Configuração da API externa ausente.",
      }
      setSessionData(result)
      lastValidationRef.current = now
      return result
    }

    setIsValidating(true)
    console.log(`🔍 useSessionValidation: Validando sessão com backend em ${ApiEndpoints.backend.validateToken}...`)

    try {
      const response = await fetch(`${ApiEndpoints.backend.validateToken}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          // TODO: Adicionar cabeçalho de autenticação se necessário para esta rota específica
          // 'Authorization': `Bearer ${your_auth_token_if_needed_for_session_check}`
        },
        signal: AbortSignal.timeout(8000), // Timeout de 8 segundos
      })

      console.log(`📡 useSessionValidation: Resposta do backend /api/auth/session: ${response.status}`)

      if (response.ok) {
        const userData = await response.json()
        const result: SessionValidationResult = {
          isValid: true,
          user: userData, // userData deve ser o objeto do usuário retornado pela sua API Spring Boot
          error: null,
        }
        setSessionData(result)
        lastValidationRef.current = now
        console.log("✅ useSessionValidation: Sessão válida no backend:", userData)
        return result
      } else {
        let errorMessage = `Erro ${response.status} ao validar sessão.`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
          // Se não conseguir parsear o JSON do erro, usa o texto da resposta ou o status
          const responseText = await response.text().catch(() => "")
          errorMessage = responseText || errorMessage
        }
        const result: SessionValidationResult = {
          isValid: false,
          user: null,
          error: errorMessage,
        }
        setSessionData(result)
        lastValidationRef.current = now
        console.warn("❌ useSessionValidation: Sessão inválida no backend:", errorMessage)
        return result
      }
    } catch (error: any) {
      let errorMessage = "Erro de conexão ao validar sessão com o backend."
      if (error.name === "TimeoutError") {
        errorMessage = "Timeout: Backend demorou muito para responder à validação de sessão."
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      const result: SessionValidationResult = {
        isValid: false,
        user: null,
        error: errorMessage,
      }
      setSessionData(result)
      lastValidationRef.current = now
      console.error("💥 useSessionValidation: Erro na validação de sessão com backend:", errorMessage, error)
      return result
    } finally {
      setIsValidating(false)
    }
  }, [sessionData, CACHE_TTL]) // Removido process.env.NEXT_PUBLIC_API_BASE_URL da dependência, pois é improvável que mude em tempo de execução

  const clearSession = useCallback(() => {
    setSessionData(null)
    lastValidationRef.current = 0
    if (cacheTimeoutRef.current) {
      clearTimeout(cacheTimeoutRef.current)
    }
    console.log("🧹 useSessionValidation: Cache de validação de sessão limpo.")
  }, [])

  useEffect(() => {
    if (sessionData) {
      cacheTimeoutRef.current = setTimeout(
        () => {
          console.log("⏰ useSessionValidation: Cache de validação de sessão expirado, limpando.")
          setSessionData(null) // Limpa para forçar revalidação na próxima chamada
        },
        CACHE_TTL - (Date.now() - lastValidationRef.current),
      ) // Ajusta o timeout para o tempo restante do TTL
    }
    return () => {
      if (cacheTimeoutRef.current) {
        clearTimeout(cacheTimeoutRef.current)
      }
    }
  }, [sessionData, CACHE_TTL])

  return {
    isValidating,
    sessionData,
    validateSession,
    clearSession,
  }
}
