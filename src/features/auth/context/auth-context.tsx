"use client"
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation" // Importar usePathname
import { authService, type User } from "@/features/auth/services/auth-service"
import { useSessionValidation } from "@/features/auth/hooks/use-session-validation"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean // Combina isLoading e isValidating
  isInitialLoading: boolean // Para o carregamento inicial da autenticação
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>
  logout: (options?: { suppressRedirect?: boolean }) => Promise<void>
  refreshAuth: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authCtxIsLoading, setAuthCtxIsLoading] = useState(true) // Renomeado para evitar conflito
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  const router = useRouter()
  const pathname = usePathname() // Obter o pathname atual
  const { validateSession, clearSession, isValidating } = useSessionValidation()

  useEffect(() => {
    setMounted(true)
  }, [])

  const checkAuthentication = useCallback(
    async (isLoginOrLogoutOperation = false) => {
      if (!mounted) return

      console.log("🔄 AuthContext: Iniciando checkAuthentication...")
      setAuthCtxIsLoading(true)

      try {
        const authStatusCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("auth_status="))
          ?.split("=")[1]

        if (authStatusCookie === "unauthenticated" && !isLoginOrLogoutOperation) {
          console.log("🍪 AuthContext: Cookie 'auth_status' indica não autenticado. Limpando estado local.")
          setUser(null)
          setIsAuthenticated(false)
          if (typeof window !== "undefined") sessionStorage.removeItem("user_data")
          // Não redirecionar daqui, deixar o middleware ou a página protegida lidar com isso
          // se não for uma operação de login/logout.
          return
        }

        console.log("🛡️ AuthContext: Validando sessão com o backend...")
        const sessionResult = await validateSession()
        console.log("🚦 AuthContext: Resultado da validação da sessão:", sessionResult)

        if (sessionResult.isValid && sessionResult.user) {
          // Tentar obter dados do usuário do authService se a sessão for válida
          // Isso pode ser redundante se sessionResult.user já for completo
          const currentUserData = await authService.getCurrentUser() // getCurrentUser pode precisar ser adaptado
          // para usar sessionResult.user se for mais confiável
          if (currentUserData) {
            setUser(currentUserData)
            setIsAuthenticated(true)
            if (typeof window !== "undefined") {
              sessionStorage.setItem("user_data", JSON.stringify(currentUserData))
            }
            console.log("✅ AuthContext: Autenticação válida. Usuário:", currentUserData)
          } else {
            // Se getCurrentUser falhar mas a sessão era válida, pode ser um problema de sincronia
            // ou o usuário não existe mais. Tratar como não autenticado.
            console.warn("⚠️ AuthContext: Sessão válida, mas falha ao obter dados do usuário do authService.")
            setUser(null)
            setIsAuthenticated(false)
            if (typeof window !== "undefined") sessionStorage.removeItem("user_data")
          }
        } else {
          console.log("🚫 AuthContext: Sessão inválida ou usuário não encontrado. Limpando estado local.")
          setUser(null)
          setIsAuthenticated(false)
          if (typeof window !== "undefined") sessionStorage.removeItem("user_data")
          // Se não estiver autenticado e estiver em uma rota protegida,
          // o middleware ou o layout protegido deve lidar com o redirecionamento.
          // Evitar redirecionamento direto daqui para não interromper fluxos.
        }
      } catch (error) {
        console.error("❌ AuthContext: Erro na verificação de autenticação:", error)
        setUser(null)
        setIsAuthenticated(false)
        if (typeof window !== "undefined") sessionStorage.removeItem("user_data")
        clearSession() // Limpar cache de validação em caso de erro
      } finally {
        console.log("🏁 AuthContext: checkAuthentication finalizado.")
        setAuthCtxIsLoading(false)
        if (isInitialLoading) setIsInitialLoading(false)
      }
    },
    [mounted, validateSession, clearSession, isInitialLoading, authService.getCurrentUser],
  ) // Adicionado authService.getCurrentUser

  useEffect(() => {
    if (mounted) {
      checkAuthentication()
    }
  }, [mounted, checkAuthentication]) // Removido checkAuthentication das dependências para evitar loop se ele mudar

  const login = async (email: string, password: string, rememberMe = false) => {
    setAuthCtxIsLoading(true)
    try {
      console.log("🔑 AuthContext: Tentando login...")
      const response = await authService.login(email, password, rememberMe)

      if (response.success) {
        console.log("🎉 AuthContext: Login bem-sucedido.")
        // Limpar cache de sessão para forçar nova validação com novos cookies/sessão
        clearSession()
        await checkAuthentication(true) // Passar true para indicar operação de login

        // Redirecionar usando o router do Next.js
        // Verificar se há um cookie de redirecionamento
        const redirectCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("redirect_after_login="))
          ?.split("=")[1]

        const destination = redirectCookie || "/modules"
        console.log(`🚀 AuthContext: Redirecionando para ${destination} após login...`)
        router.push(destination)

        // Remover o cookie de redirecionamento
        if (redirectCookie && typeof window !== "undefined") {
          document.cookie = "redirect_after_login=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
        }

        return { success: true }
      } else {
        console.log("🙁 AuthContext: Falha no login:", response.message)
        setAuthCtxIsLoading(false)
        return { success: false, message: response.message || "Erro na autenticação" }
      }
    } catch (error) {
      console.error("💥 AuthContext: Erro catastrófico no login:", error)
      setAuthCtxIsLoading(false)
      return { success: false, message: "Erro inesperado durante o login" }
    }
    // O finally do checkAuthentication cuidará de setAuthCtxIsLoading(false)
  }

  const logout = async (options?: { suppressRedirect?: boolean }) => {
    setAuthCtxIsLoading(true)
    console.log("🚪 AuthContext: Tentando logout...")
    try {
      await authService.logout()
    } catch (error) {
      console.error("⚠️ AuthContext: Erro durante a chamada de logout ao backend (continuando com logout local):", error)
    } finally {
      // Sempre limpar o estado local e cookies, mesmo se o logout do backend falhar
      setUser(null)
      setIsAuthenticated(false)
      if (typeof window !== "undefined") sessionStorage.removeItem("user_data")
      clearSession() // Limpar cache de validação

      // Limpar cookie de status de autenticação
      if (typeof window !== "undefined") {
        document.cookie = "auth_status=unauthenticated; Path=/; Max-Age=60; SameSite=Lax"
        // Tentar limpar cookies de autenticação específicos se conhecidos (ex: JSESSIONID)
        // Isso é mais difícil de fazer de forma genérica e segura do lado do cliente
        // O backend deve invalidar a sessão e os cookies HttpOnly.
      }

      console.log("✅ AuthContext: Logout local concluído.")
      setAuthCtxIsLoading(false)
      setIsInitialLoading(false) // Garante que não estamos mais no carregamento inicial

      if (!options?.suppressRedirect) {
        console.log("↪️ AuthContext: Redirecionando para /login após logout...")
        router.push("/login")
      }
    }
  }

  const refreshAuth = async () => {
    console.log("🔄 AuthContext: Solicitada atualização de autenticação (refreshAuth).")
    clearSession() // Limpar cache para forçar nova validação
    await checkAuthentication()
  }

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prevUser) => {
      if (prevUser) {
        const updatedUser = { ...prevUser, ...userData }
        if (typeof window !== "undefined") {
          sessionStorage.setItem("user_data", JSON.stringify(updatedUser))
        }
        return updatedUser
      }
      return null
    })
  }, [])

  // isLoading combina o carregamento do AuthContext e a validação da sessão
  const combinedIsLoading = mounted ? authCtxIsLoading || isValidating : true

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading: combinedIsLoading,
    isInitialLoading: mounted ? isInitialLoading : true,
    login,
    logout,
    refreshAuth,
    updateUser,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
