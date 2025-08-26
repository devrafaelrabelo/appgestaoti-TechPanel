"use client"

import { useState, useEffect, useCallback } from "react"
import type {
  Function,
  CreateFunctionPayload,
  UpdateFunctionPayload,
  FunctionFilters,
  FunctionStats,
} from "@/types/function"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import { useToast } from "@/components/ui/use-toast"

export function useFunctions() {
  const [functions, setFunctions] = useState<Function[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<FunctionStats>({ total: 0, byDepartment: {} })
  const { toast } = useToast()

  // Buscar funções
  const fetchFunctions = useCallback(
    async (filters?: FunctionFilters) => {
      setLoading(true)
      setError(null)

      try {
        const queryParams = new URLSearchParams()
        if (filters?.search) queryParams.append("search", filters.search)
        if (filters?.departmentId) queryParams.append("departmentId", filters.departmentId)

        const url = `${ApiEndpoints.backend.adminFunctionList}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
        const response = await fetchWithValidation(url)

        if (!response.ok) {
          throw new Error("Erro ao buscar funções")
        }

        const data = await response.json()
        setFunctions(data.functions || [])

        // Calcular estatísticas
        const total = data.functions?.length || 0
        const byDepartment: Record<string, number> = {}

        data.functions?.forEach((func: Function) => {
          byDepartment[func.departmentId] = (byDepartment[func.departmentId] || 0) + 1
        })

        setStats({ total, byDepartment })
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

  // Criar função
  const createFunction = useCallback(
    async (payload: CreateFunctionPayload): Promise<boolean> => {
      try {
        const response = await fetchWithValidation(ApiEndpoints.backend.adminFunctionCreate, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Erro ao criar função")
        }

        toast({
          title: "Sucesso",
          description: "Função criada com sucesso!",
        })

        await fetchFunctions()
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
    [fetchFunctions, toast],
  )

  // Atualizar função
  const updateFunction = useCallback(
    async (id: string, payload: UpdateFunctionPayload): Promise<boolean> => {
      try {
        const response = await fetchWithValidation(`${ApiEndpoints.backend.adminFunctionIdAlter}${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Erro ao atualizar função")
        }

        toast({
          title: "Sucesso",
          description: "Função atualizada com sucesso!",
        })

        await fetchFunctions()
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
    [fetchFunctions, toast],
  )

  // Excluir função
  const deleteFunction = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await fetchWithValidation(`${ApiEndpoints.backend.adminFunctionIdDelete}${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Erro ao excluir função")
        }

        toast({
          title: "Sucesso",
          description: "Função excluída com sucesso!",
        })

        await fetchFunctions()
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
    [fetchFunctions, toast],
  )

  // Buscar função por ID
  const getFunctionById = useCallback(
    async (id: string): Promise<Function | null> => {
      try {
        const response = await fetchWithValidation(`${ApiEndpoints.backend.adminFunctionId}${id}`)

        if (!response.ok) {
          throw new Error("Função não encontrada")
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

  // Carregar funções na inicialização
  useEffect(() => {
    fetchFunctions()
  }, [fetchFunctions])

  return {
    functions,
    loading,
    error,
    stats,
    fetchFunctions,
    createFunction,
    updateFunction,
    deleteFunction,
    getFunctionById,
  }
}
