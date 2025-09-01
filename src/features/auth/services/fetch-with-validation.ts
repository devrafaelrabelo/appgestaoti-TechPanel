import { ApiEndpoints } from "@/lib/api-endpoints"

const REDIRECT_URL = "/login" // Centralizar a URL de redirecionamento
const DEFAULT_RETRIES = 1 // Número padrão de tentativas
const DEFAULT_TIMEOUT = 10000 // Timeout padrão em milissegundos

interface FetchWithValidationOptions {
  retries?: number
  timeout?: number
  onSessionExpired?: () => void
  logger?: (message: string, error?: unknown) => void
}

async function fetchWithValidation(
  input: RequestInfo,
  init?: RequestInit,
  options: FetchWithValidationOptions = {}
): Promise<Response> {
  const { retries = DEFAULT_RETRIES, timeout = DEFAULT_TIMEOUT, onSessionExpired, logger } = options

  try {
    const response = await performFetchWithTimeout(input, init, timeout)

    if (response.status === 401 || response.status === 403) {
      // Tenta validar sessão
      const isSessionValid = await validateSession(logger)
      if (isSessionValid) {
        // Se a sessão ainda estiver válida (renovada), tenta novamente
        return performFetchWithTimeout(input, init, timeout)
      }

      // Caso contrário, redireciona ou executa callback
      if (onSessionExpired) {
        onSessionExpired()
      } else {
        handleSessionExpired()
      }
    }

    return response
  } catch (error) {
    logger?.("Erro ao realizar a requisição:", error)
    throw error
  }
}

// Função auxiliar para realizar o fetch com timeout
async function performFetchWithTimeout(
  input: RequestInfo,
  init?: RequestInit,
  timeout: number = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    return await fetch(input, {
      ...init,
      credentials: "include",
      signal: controller.signal,
    })
  } finally {
    clearTimeout(id)
  }
}

// Função para validar a sessão
async function validateSession(logger?: (message: string, error?: unknown) => void): Promise<boolean> {
  try {
    const validateResponse = await fetch(`${ApiEndpoints.backend.validateToken}`, {
      method: "GET",
      credentials: "include",
    })
    return validateResponse.ok
  } catch (error) {
    logger?.("Erro ao validar a sessão:", error)
    return false
  }
}

// Função para lidar com sessão expirada
function handleSessionExpired(): void {
  window.location.href = REDIRECT_URL
  throw new Error("Sessão expirada. Redirecionando para login...")
}

export default fetchWithValidation