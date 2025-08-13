"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/hooks/use-theme"
import { userPreferencesService } from "@/features/user/services/user-preferences-service"
import { useAuth } from "@/features/auth/context/auth-context"

export function useUserTheme() {
  const { theme, setTheme, resolvedTheme, mounted, toggleTheme, isLight, isDark } = useTheme()
  const { isAuthenticated, isLoading } = useAuth()
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false)

  // Buscar preferências do usuário após o login
  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (isAuthenticated && !isLoading) {
        setIsLoadingPreferences(true)
        try {
          const preferences = await userPreferencesService.getUserPreferences()
          if (preferences.theme) {
            setTheme(preferences.theme)
          }
        } catch (error) {
          console.error("Erro ao buscar preferências de tema:", error)
        } finally {
          setIsLoadingPreferences(false)
        }
      }
    }

    fetchUserPreferences()
  }, [isAuthenticated, isLoading, setTheme])

  // Função para salvar o tema do usuário
  const saveUserTheme = async (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)

    if (isAuthenticated) {
      try {
        await userPreferencesService.saveUserTheme(newTheme)
      } catch (error) {
        console.error("Erro ao salvar preferência de tema:", error)
      }
    }
  }

  return {
    theme,
    setTheme: saveUserTheme,
    resolvedTheme,
    mounted,
    toggleTheme: async () => {
      const newTheme = resolvedTheme === "dark" ? "light" : "dark"
      await saveUserTheme(newTheme)
    },
    isLight,
    isDark,
    isLoadingPreferences,
  }
}
