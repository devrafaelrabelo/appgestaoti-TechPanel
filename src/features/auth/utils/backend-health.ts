import { ApiEndpoints } from "@/lib/api-endpoints"

export interface BackendHealthStatus {
  isOnline: boolean
  status: "online" | "offline" | "error" | "cors" | "timeout" | "slow"
  message: string
  responseTime?: number
  endpoint?: string
}

/**
 * Verifica se o backend Spring Boot está online e acessível
 */
export const checkBackendHealth = async (): Promise<BackendHealthStatus> => {
  const startTime = Date.now()
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)
  
  const endpoint = ApiEndpoints.backend.health
  try {
    const response = await fetch(ApiEndpoints.backend.health, {
      method: "GET",
      headers: {
        Accept: "application/json", // manter
      },
      signal: controller.signal,     // manter
    })

    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime

    if (response.ok || response.status === 401 || response.status === 403 ) {
      if (responseTime > 300) {
        console.warn(`responseTime > 300`)
        return {
          isOnline: true,
          status: "slow",
          message: `Backend online, mas lento (${responseTime}ms)`,
          responseTime,
          endpoint,
        }
      }
      
      
      return {
        isOnline: true,
        status: "online",
        message: `Backend online (${response.status})`,
        responseTime,
        endpoint,
      }
    }

    
    return {      
      isOnline: false,
      status: "error",
      message: `Resposta inesperada: ${response.status}`,
      responseTime,
      endpoint,
    }

  } catch (error: any) {
    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime

    if (error.name === "AbortError") {
      return {
        isOnline: false,
        status: "timeout",
        message: "Timeout: Backend não respondeu em 5 segundos",
        responseTime,
        endpoint,
      }
    }

    return {
      isOnline: false,
      status: "offline",
      message: `Erro ao conectar: ${error.message}`,
      responseTime,
      endpoint,
    }
  }
}

/**
 * Verifica conectividade e retorna uma mensagem amigável para o usuário
 */
export const getBackendStatusMessage = async (): Promise<string> => {
  const health = await checkBackendHealth()

  switch (health.status) {
    case "online":
      return `✅ Conectado ao servidor (${health.responseTime}ms)`

    case "offline":
      return `❌ Servidor offline. Verifique se o Spring Boot está rodando em ${process.env.NEXT_PUBLIC_API_BASE_URL}`

    case "timeout":
      return `⏱️ Servidor não responde. Verifique a conexão de rede`

    case "cors":
      return `🚫 Problema de CORS. Configure o backend para aceitar requisições de ${window.location.origin}`

    case "slow":
    return `🐢 Servidor lento. Resposta demorou ${health.responseTime}ms`

    case "error":
      return `⚠️ Erro no servidor: ${health.message}`

    default:
      return `❓ Status desconhecido do servidor`
  }
}
