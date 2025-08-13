import { API_URL } from "@/config"
import { ApiEndpoints } from "@/lib/api-endpoints"

interface UserPreferences {
  theme?: "light" | "dark" | "system"
  language?: string
  notifications?: boolean
  // Outras preferências que o usuário possa ter
}

export const userPreferencesService = {
  /**
   * Busca as preferências do usuário do backend
   */
  async getUserPreferences(): Promise<UserPreferences> {
    try {
      // Buscar o tema
      const themeResponse = await fetch(`${ApiEndpoints.backend.userMenu}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      let theme: "light" | "dark" | "system" = "system"

      if (themeResponse.ok) {
        const themeData = await themeResponse.json()
        theme = themeData.theme || "system"
      }

      // Aqui você pode adicionar mais chamadas para buscar outras preferências
      // quando novos endpoints estiverem disponíveis

      return {
        theme,
        // Outras preferências seriam adicionadas aqui
      }
    } catch (error) {
      console.error("Erro ao buscar preferências do usuário:", error)
      // Retornar preferências padrão em caso de erro
      return { theme: "system" }
    }
  },

  /**
   * Salva as preferências do usuário no backend
   */
  async saveUserPreferences(preferences: UserPreferences): Promise<boolean> {
    try {
      // Se temos um tema para salvar, usamos o endpoint específico
      if (preferences.theme) {
        const themeSuccess = await this.saveUserTheme(preferences.theme)
        if (!themeSuccess) return false
      }

      // Aqui você pode adicionar mais chamadas para salvar outras preferências
      // quando novos endpoints estiverem disponíveis

      return true
    } catch (error) {
      console.error("Erro ao salvar preferências do usuário:", error)
      return false
    }
  },

  /**
   * Atualiza apenas o tema do usuário
   */
  async saveUserTheme(theme: "light" | "dark" | "system"): Promise<boolean> {
    try {
      const response = await fetch(`${ApiEndpoints.backend.userMenu}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme }),
      })

      return response.ok
    } catch (error) {
      console.error("Erro ao salvar tema do usuário:", error)
      return false
    }
  },
}
