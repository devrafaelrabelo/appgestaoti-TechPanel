import { ApiEndpoints } from "@/lib/api-endpoints" 
import { checkBackendHealth, getBackendStatusMessage } from "../utils/backend-health"
import fetchWithValidation from "./fetch-with-validation"

// Tipos para autenticação
export interface User {
  id?: string
  username: string // Mantido para compatibilidade, mas pode ser derivado do email
  fullName?: string
  email?: string
  avatar?: string | null
  preferredLanguage?: string
  interfaceTheme?: string
  roles?: string[]
  departments?: string[] // Novo campo
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
  const userData = data.user || data // Lida com diferentes estruturas de resposta
  return {
    id: userData.id || userData.userId,
    username: userData.username || userData.login || (userData.email ? userData.email.split("@")[0] : "unknown"),
    fullName: userData.fullName || userData.nome || userData.name,
    email: userData.email,
    avatar: userData.avatar,
    preferredLanguage: userData.preferredLanguage,
    interfaceTheme: userData.interfaceTheme,
    roles: userData.roles || userData.authorities || [],
    departments: userData.departments || [], // Mapeia o novo campo
    userGroups: userData.userGroups || [],
    position: userData.position,
    functions: userData.functions || [],
    permissions: userData.permissions || [],
  }
}

// Função auxiliar para verificar se estamos em ambiente de cliente (browser)
const isClient = typeof window !== "undefined"

// Serviço de autenticação para backend Java Spring com cookies HttpOnly
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
   * Realiza o login do usuário no backend Spring Boot.
   * O backend deve definir os cookies HttpOnly na resposta.
   */
  login: async (email: string, password: string, rememberMe = false): Promise<AuthResponse> => {
    try {
      console.log("🔐 Iniciando login para:", email)

      // Verificar conectividade primeiro
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
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
        credentials: "include", // Essencial para receber cookies HttpOnly
        signal: AbortSignal.timeout(10000),
      })

      console.log("📡 Status da resposta Spring:", response.status)

      // ✅ Tratar 2FA (Status 206 - Partial Content)
      if (response.status === 206) {
        try {
          const data = await response.json()
          console.log("🔐 2FA necessário:", data)

          if (data["2fa_required"] === true) {
            return {
              success: false,
              requires2FA: true,
              message: data.message || "Autenticação de dois fatores necessária",
              sessionId: data.sessionId || data.session_id,
              backendStatus: "🔐 2FA Requerido",
            }
          }
        } catch (parseError) {
          console.error("❌ Erro ao processar resposta 2FA:", parseError)
        }
      }

      if (response.ok) {
        let responseData: any = {}
        try {
          const responseText = await response.text()
          if (responseText.trim()) {
            responseData = JSON.parse(responseText)
          }
        } catch (parseError) {
          console.warn("⚠️ Resposta sem JSON, mas cookies podem ter sido definidos.")
        }

        // Aguardar processamento dos cookies HttpOnly pelo navegador
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Após o login, o endpoint /me geralmente é chamado para obter todos os detalhes do usuário
        // Se o endpoint de login já retorna todos os dados, podemos usar responseData.data
        // Caso contrário, precisaríamos de uma chamada separada para /me aqui.
        // Para este exemplo, vamos simular que o login já retorna os dados necessários ou que
        // o AuthContext fará a chamada para getCurrentUser que busca do /me.

        // Se o endpoint de login já retorna os dados do usuário (incluindo departments)
        // no formato esperado por parseUser (ex: responseData.data ou responseData.user)
        const user = parseUser(responseData.data || responseData.user || { email })

        return {
          success: true,
          user: user,
          backendStatus: "✅ Conectado",
        }
      }

      // Tratar erros
      let errorMessage = "Erro ao realizar login"
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch {
        switch (response.status) {
          case 401:
            errorMessage = "Email ou senha incorretos"
            break
          case 403:
            errorMessage = "Acesso negado"
            break
          default:
            errorMessage = `Erro HTTP ${response.status}`
        }
      }

      return {
        success: false,
        message: errorMessage,
        backendStatus: `⚠️ Erro ${response.status}`,
      }
    } catch (error: any) {
      console.error("❌ Erro na requisição de login:", error)

      if (error.name === "TimeoutError") {
        return {
          success: false,
          message: "Timeout: O servidor demorou muito para responder.",
        }
      }

      return {
        success: false,
        message: "Erro de conexão com o servidor.",
      }
    }
  },

  /**
   * Verifica o código de autenticação de dois fatores
   */
  verify2FA: async (code: string, rememberMe = false): Promise<AuthResponse> => {
    try {
      console.log("🔐 Verificando código 2FA...")

      const response = await fetch(`${ApiEndpoints.backend.verify2fa}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          twoFactorCode: code,
          rememberMe: rememberMe,
        }),
        credentials: "include",
        signal: AbortSignal.timeout(10000),
      })

      console.log("📡 Status da verificação 2FA:", response.status)

      if (response.ok) {
        let responseData: any = {}
        try {
          const responseText = await response.text()
          if (responseText.trim()) {
            responseData = JSON.parse(responseText)
          }
        } catch (parseError) {
          console.warn("⚠️ Resposta sem JSON, mas cookies podem ter sido definidos.")
        }

        await new Promise((resolve) => setTimeout(resolve, 500))
        const user = parseUser(responseData.data || responseData.user)

        return {
          success: true,
          user: user,
          backendStatus: "✅ 2FA Verificado",
        }
      }

      let errorMessage = "Código de verificação inválido"
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch {
        // ... (tratamento de erro existente)
      }

      return {
        success: false,
        message: errorMessage,
        backendStatus: `⚠️ Erro 2FA ${response.status}`,
      }
    } catch (error: any) {
      // ... (tratamento de erro existente)
      if (error.name === "TimeoutError") {
        return {
          success: false,
          message: "Timeout: O servidor demorou muito para responder.",
        }
      }
      return {
        success: false,
        message: "Erro de conexão com o servidor.",
      }
    }
  },

  /**
   * Obtém o perfil do usuário atual validando os cookies HttpOnly com o backend.
   * Esta é a ÚNICA forma segura de verificar autenticação com cookies HttpOnly.
   * Esta função agora buscará do endpoint /me.
   */
  getCurrentUser: async (): Promise<User | null> => {
    if (!isClient) return null

    const authStatusCookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith("auth_status="))
      ?.split("=")[1]

    if (authStatusCookie === "unauthenticated") {
      console.log("⛔ auth_status indica que usuário não está autenticado — ignorando chamada /me")
      return null
    }

    try {
      console.log("🔄 Verificando usuário atual com backend (/me)...")

      // Endpoint /me para obter dados do usuário
      const response = await fetchWithValidation(`${ApiEndpoints.backend.userMe}`, {
        // Alterado para /api/users/me
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent": navigator.userAgent, // Adicionado User-Agent
        },
        credentials: "include",
        signal: AbortSignal.timeout(5000),
      })

      if (response.ok) {
        const responseData = await response.json()
        if (responseData.success && responseData.data) {
          console.log("✅ Usuário validado com sucesso via /me:", responseData.data)
          return parseUser(responseData.data) // parseUser espera o objeto de dados do usuário
        } else {
          console.warn("🚫 Resposta de /me não foi bem-sucedida ou não continha dados:", responseData)
          return null
        }
      }  
      
      console.warn("🚫 Validação com /me falhou. Status:", response.status)
      return null
    } catch (error) {
      console.error("❌ Erro ao validar usuário com /me:", error)
      return null
    }
  },

  /**
   * Realiza o logout no backend Spring Boot.
   * O backend deve invalidar/remover os cookies HttpOnly.
   */
  logout: async (): Promise<void> => {
    if (!isClient) return

    console.log("🚪 Iniciando logout...")

    try {
      const response = await fetch(`${ApiEndpoints.backend.logout}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include", // Envia cookies para invalidação
        signal: AbortSignal.timeout(5000),
      })

      if (response.ok) {
        console.log("✅ Logout realizado com sucesso.")
      } else {
        console.warn("⚠️ Logout falhou no backend, mas dados locais serão limpos.")
      }
    } catch (error: any) {
      console.error("❌ Erro ao fazer logout:", error)
    }
  },
}
