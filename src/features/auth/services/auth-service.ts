import { ApiEndpoints } from "@/lib/api-endpoints"
import { checkBackendHealth, getBackendStatusMessage } from "../utils/backend-health"
import fetchWithValidation from "./fetch-with-validation"

// Constantes
const TIMEOUT = 10000
const DEFAULT_RETRIES = 1
const ERROR_MESSAGES = {
  loginFailed: "Erro ao realizar login",
  invalidCredentials: "Email ou senha incorretos",
  accessDenied: "Acesso negado",
  timeout: "Timeout: O servidor demorou muito para responder.",
  connectionError: "Erro de conexão com o servidor.",
  invalid2FA: "Código de verificação inválido",
}

// Tipos para autenticação
export interface User {
  id?: string
  username: string
  fullName?: string
  email?: string
  avatar?: string | null
  preferredLanguage?: string
  interfaceTheme?: string
  roles?: string[]
  departments?: string[]
  userGroups?: string[]
  position?: string
  functions?: string[]
  permissions?: string[]
}

export interface AuthResponse {
  success: boolean
  message?: string
  user?: User
  backendStatus?: string
  requires2FA?: boolean
  sessionId?: string
}

// Função auxiliar para analisar os dados do usuário
const parseUser = (data: any): User => {
  const userData = data.user || data
  return {
    id: userData.id || userData.userId,
    username: userData.username || userData.login || (userData.email ? userData.email.split("@")[0] : "unknown"),
    fullName: userData.fullName || userData.nome || userData.name,
    email: userData.email,
    avatar: userData.avatar,
    preferredLanguage: userData.preferredLanguage,
    interfaceTheme: userData.interfaceTheme,
    roles: userData.roles || userData.authorities || [],
    departments: userData.departments || [],
    userGroups: userData.userGroups || [],
    position: userData.position,
    functions: userData.functions || [],
    permissions: userData.permissions || [],
  }
}

// Função auxiliar para tratar erros de resposta
const handleErrorResponse = async (response: Response): Promise<string> => {
  try {
    const errorData = await response.json()
    return errorData.message || errorData.error || ERROR_MESSAGES.loginFailed
  } catch {
    switch (response.status) {
      case 401:
        return ERROR_MESSAGES.invalidCredentials
      case 403:
        return ERROR_MESSAGES.accessDenied
      default:
        return `Erro HTTP ${response.status}`
    }
  }
}

// Serviço de autenticação
export const authService = {
  /**
   * Verifica se o backend está online e acessível
   */
  checkBackendConnection: async (): Promise<{ isOnline: boolean; message: string }> => {
    const health = await checkBackendHealth()
    const message = await getBackendStatusMessage()

    return {
      isOnline: health.isOnline,
      message,
    }
  },

  /**
   * Realiza o login do usuário no backend.
   */
  login: async (email: string, password: string, rememberMe = false): Promise<AuthResponse> => {
    try {
      const backendStatus = await authService.checkBackendConnection()
      if (!backendStatus.isOnline) {
        return {
          success: false,
          message: backendStatus.message,
          backendStatus: backendStatus.message,
        }
      }

      const response = await fetch(`${ApiEndpoints.backend.login}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ email, password, rememberMe }),
        credentials: "include",
        signal: AbortSignal.timeout(TIMEOUT),
      })

      if (response.status === 206) {
        const data = await response.json()
        if (data["2fa_required"]) {
          return {
            success: false,
            requires2FA: true,
            message: data.message || "Autenticação de dois fatores necessária",
            sessionId: data.sessionId || data.session_id,
            backendStatus: "🔐 2FA Requerido",
          }
        }
      }

      if (response.ok) {
        const responseData = await response.json()
        const user = parseUser(responseData.data || responseData.user || { email })
        return {
          success: true,
          user,
          backendStatus: "✅ Conectado",
        }
      }

      const errorMessage = await handleErrorResponse(response)
      return {
        success: false,
        message: errorMessage,
        backendStatus: `⚠️ Erro ${response.status}`,
      }
    } catch (error: any) {
      console.error("❌ Erro na requisição de login:", error)
      if (error.name === "TimeoutError") {
        return { success: false, message: ERROR_MESSAGES.timeout }
      }
      return { success: false, message: ERROR_MESSAGES.connectionError }
    }
  },

  /**
   * Verifica o código de autenticação de dois fatores
   */
  verify2FA: async (code: string, rememberMe = false): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${ApiEndpoints.backend.verify2fa}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ twoFactorCode: code, rememberMe }),
        credentials: "include",
        signal: AbortSignal.timeout(TIMEOUT),
      })

      if (response.ok) {
        const responseData = await response.json()
        const user = parseUser(responseData.data || responseData.user)
        return {
          success: true,
          user,
          backendStatus: "✅ 2FA Verificado",
        }
      }

      const errorMessage = await handleErrorResponse(response)
      return {
        success: false,
        message: errorMessage,
        backendStatus: `⚠️ Erro 2FA ${response.status}`,
      }
    } catch (error: any) {
      console.error("❌ Erro ao verificar 2FA:", error)
      if (error.name === "TimeoutError") {
        return { success: false, message: ERROR_MESSAGES.timeout }
      }
      return { success: false, message: ERROR_MESSAGES.connectionError }
    }
  },

  /**
   * Obtém o perfil do usuário atual
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.userMe}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        signal: AbortSignal.timeout(TIMEOUT),
      })

      if (response.ok) {
        const responseData = await response.json()
        return parseUser(responseData.data || responseData.user)
      }

      console.warn("🚫 Validação com /me falhou. Status:", response.status)
      return null
    } catch (error) {
      console.error("❌ Erro ao validar usuário com /me:", error)
      return null
    }
  },

  /**
   * Realiza o logout no backend
   */
  logout: async (): Promise<void> => {
    try {
      const response = await fetch(`${ApiEndpoints.backend.logout}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        signal: AbortSignal.timeout(TIMEOUT),
      })

      if (!response.ok) {
        console.warn("⚠️ Logout falhou no backend, mas dados locais serão limpos.")
      }
    } catch (error) {
      console.error("❌ Erro ao fazer logout:", error)
    }
  },
}