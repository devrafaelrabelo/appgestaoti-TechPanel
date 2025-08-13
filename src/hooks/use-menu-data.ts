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

      console.log("Iniciando fetch do menu data...")

      const response = await fetchWithValidation(`${ApiEndpoints.backend.userPermissions}`)

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados do menu: ${response.status}`)
      }

      const rawMenuData: MenuData = await response.json()

      // Detecta o sistema atual baseado na URL
      const currentSystem = getCurrentSystem(pathname)

      console.log("=== DADOS RECEBIDOS ===")
      console.log("Sistema atual detectado:", currentSystem)
      console.log("Pathname atual:", pathname)
      console.log("Dados brutos do menu:", JSON.stringify(rawMenuData, null, 2))

      // Processa os dados do menu considerando o sistema atual
      const processedData = processMenuData(rawMenuData, currentSystem)

      console.log("=== DADOS PROCESSADOS ===")
      console.log("Dados processados do menu:", JSON.stringify(processedData, null, 2))

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
    console.log("useEffect disparado - pathname mudou:", pathname)
    fetchMenuData()
  }, [pathname]) // Recarrega quando a rota muda para detectar mudanças de sistema

  return { menuData, isLoading, error, refetch: fetchMenuData }
}
