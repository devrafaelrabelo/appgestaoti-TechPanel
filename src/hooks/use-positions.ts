"use client"

import { useState, useEffect, useCallback } from "react"
import type {
  Position,
  CreatePositionPayload,
  UpdatePositionPayload,
  PositionFilters,
  PositionStats,
} from "@/types/position"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import { useToast } from "@/components/ui/use-toast"

export function usePositions() {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<PositionStats>({ total: 0 })
  const { toast } = useToast()

  // Buscar posições
  const fetchPositions = useCallback(
    async (filters?: PositionFilters) => {
      setLoading(true)
      setError(null)

      try {
        const queryParams = new URLSearchParams()
        if (filters?.search) queryParams.append("search", filters.search)

        const url = `${ApiEndpoints.backend.adminPositionList}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
        const response = await fetchWithValidation(url)

        if (!response.ok) {
          throw new Error("Erro ao buscar posições")
        }

        const data = await response.json()
        setPositions(data.positions || [])

        // Calcular estatísticas
        const total = data.positions?.length || 0
        setStats({ total })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
        setError(errorMessage)
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  // Criar posição
  const createPosition = useCallback(
    async (payload: CreatePositionPayload): Promise<boolean> => {
      try {
        const response = await fetchWithValidation(ApiEndpoints.backend.adminPositionCreate, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Erro ao criar posição")
        }

        toast({
          title: "Sucesso",
          description: "Posição criada com sucesso!",
        })

        await fetchPositions()
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        })
        return false
      }
    },
    [fetchPositions, toast],
  )

  // Atualizar posição
  const updatePosition = useCallback(
    async (id: string, payload: UpdatePositionPayload): Promise<boolean> => {
      try {
        const response = await fetchWithValidation(`${ApiEndpoints.backend.adminPositionIdAlter}${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Erro ao atualizar posição")
        }

        toast({
          title: "Sucesso",
          description: "Posição atualizada com sucesso!",
        })

        await fetchPositions()
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        })
        return false
      }
    },
    [fetchPositions, toast],
  )

  // Excluir posição
  const deletePosition = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await fetchWithValidation(`${ApiEndpoints.backend.adminPositionIdDelete}${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Erro ao excluir posição")
        }

        toast({
          title: "Sucesso",
          description: "Posição excluída com sucesso!",
        })

        await fetchPositions()
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        })
        return false
      }
    },
    [fetchPositions, toast],
  )

  // Buscar posição por ID
  const getPositionById = useCallback(
    async (id: string): Promise<Position | null> => {
      try {
        const response = await fetchWithValidation(`${ApiEndpoints.backend.adminPositionId}${id}`)

        if (!response.ok) {
          throw new Error("Posição não encontrada")
        }

        return await response.json()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        })
        return null
      }
    },
    [toast],
  )

  // Carregar posições na inicialização
  useEffect(() => {
    fetchPositions()
  }, [fetchPositions])

  return {
    positions,
    loading,
    error,
    stats,
    fetchPositions,
    createPosition,
    updatePosition,
    deletePosition,
    getPositionById,
  }
}
