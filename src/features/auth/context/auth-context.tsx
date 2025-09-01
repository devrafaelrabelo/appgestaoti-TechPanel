"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { authService, type User } from "@/features/auth/services/auth-service"
import { useSessionValidation } from "@/features/auth/hooks/use-session-validation"

// Constantes
const AUTH_STATUS_COOKIE = "auth_status"
const REDIRECT_COOKIE = "redirect_after_login"
const DEFAULT_REDIRECT = "/modules"
const LOGIN_ROUTE = "/login"
const ERROR_MESSAGES = {
  loginFailed: "Erro na autenticação",
  unexpectedError: "Erro inesperado",
  logoutFailed: "Erro durante o logout",
  sessionFetchFailed: "Erro ao obter dados do usuário",
}

// Tipagem do contexto
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>
  logout: (options?: { suppressRedirect?: boolean }) => Promise<void>
  refreshAuth: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authCtxIsLoading, setAuthCtxIsLoading] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const router = useRouter()
  const pathname = usePathname()
  const { validateSession, clearSession, isValidating } = useSessionValidation()

  // Função auxiliar para manipular cookies
  const getCookie = (name: string): string | undefined => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1]
  }

  const setCookie = (name: string, value: string, options?: { maxAge?: number }) => {
    const maxAge = options?.maxAge ? `; Max-Age=${options.maxAge}` : ""
    document.cookie = `${name}=${value}; Path=/; SameSite=Lax${maxAge}`
  }

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  }

  // Função para verificar autenticação
  const checkAuthentication = useCallback(async (isLoginOrLogoutOperation = false) => {
    setAuthCtxIsLoading(true)
    try {
      const authStatus = getCookie(AUTH_STATUS_COOKIE)

      if (authStatus === "unauthenticated" && !isLoginOrLogoutOperation) {
        setUser(null)
        setIsAuthenticated(false)
        sessionStorage.removeItem("user_data")
        return
      }

      const sessionResult = await validateSession()
      if (sessionResult.isValid && sessionResult.user) {
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          setIsAuthenticated(true)
          sessionStorage.setItem("user_data", JSON.stringify(currentUser))
        } else {
          console.warn(ERROR_MESSAGES.sessionFetchFailed)
          setUser(null)
          setIsAuthenticated(false)
          sessionStorage.removeItem("user_data")
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
        sessionStorage.removeItem("user_data")
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error)
      setUser(null)
      setIsAuthenticated(false)
      sessionStorage.removeItem("user_data")
      clearSession()
    } finally {
      setAuthCtxIsLoading(false)
      setIsInitialLoading(false)
    }
  }, [validateSession, clearSession])

  useEffect(() => {
    checkAuthentication()
  }, [checkAuthentication])

  // Função de login
  const login = async (email: string, password: string, rememberMe = false) => {
    setAuthCtxIsLoading(true)
    try {
      const response = await authService.login(email, password, rememberMe)
      if (response.success) {
        clearSession()
        await checkAuthentication(true)

        const redirectDestination = getCookie(REDIRECT_COOKIE) || DEFAULT_REDIRECT
        router.push(redirectDestination)
        deleteCookie(REDIRECT_COOKIE)

        return { success: true }
      } else {
        return { success: false, message: response.message || ERROR_MESSAGES.loginFailed }
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      return { success: false, message: ERROR_MESSAGES.unexpectedError }
    } finally {
      setAuthCtxIsLoading(false)
    }
  }

  // Função de logout
  const logout = async (options?: { suppressRedirect?: boolean }) => {
    setAuthCtxIsLoading(true)
    try {
      await authService.logout()
    } catch (error) {
      console.error(ERROR_MESSAGES.logoutFailed, error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      sessionStorage.removeItem("user_data")
      clearSession()
      setCookie(AUTH_STATUS_COOKIE, "unauthenticated", { maxAge: 60 })

      if (!options?.suppressRedirect) {
        router.push(LOGIN_ROUTE)
      }
      setAuthCtxIsLoading(false)
    }
  }

  // Função para atualizar autenticação
  const refreshAuth = async () => {
    clearSession()
    await checkAuthentication()
  }

  // Função para atualizar o usuário
  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prevUser) => {
      if (prevUser) {
        const updatedUser = { ...prevUser, ...userData }
        sessionStorage.setItem("user_data", JSON.stringify(updatedUser))
        return updatedUser
      }
      return null
    })
  }, [])

  const combinedIsLoading = authCtxIsLoading || isValidating

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading: combinedIsLoading,
      isInitialLoading,
      login,
      logout,
      refreshAuth,
      updateUser,
    }),
    [user, isAuthenticated, combinedIsLoading, isInitialLoading, login, logout, refreshAuth, updateUser]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}