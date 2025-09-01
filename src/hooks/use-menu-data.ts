"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import type { MenuData, ProcessedMenuData } from "@/types/menu"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { processMenuData, getCurrentSystem } from "@/app/utils/menu-permissions"
import { ApiEndpoints } from "@/lib/api-endpoints"

export function useMenuData() {
  const [menuData, setMenuData] = useState<ProcessedMenuData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()

  const fetchMenuData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetchWithValidation(`${ApiEndpoints.backend.userPermissions}`)

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados do menu: ${response.status}`)
      }

      const rawMenuData: MenuData = await response.json()

      // Detecta o sistema atual baseado na URL
      const currentSystem = getCurrentSystem(pathname)
      // Processa os dados do menu considerando o sistema atual
      const processedData = processMenuData(rawMenuData, currentSystem)

      setMenuData(processedData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar menu"
      setError(errorMessage)
      console.error("Erro ao buscar dados do menu:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMenuData()
  }, [pathname]) // Recarrega quando a rota muda para detectar mudanças de sistema

  return { menuData, isLoading, error, refetch: fetchMenuData }
}
