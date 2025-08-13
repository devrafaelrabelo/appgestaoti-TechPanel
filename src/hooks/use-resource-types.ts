"use client"

import { useState, useEffect, useCallback } from "react"
import  fetchWithValidation  from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import type { ResourceType, ResourceTypeFilters } from "@/types/resource-type"
import { useToast } from "@/components/ui/use-toast"

export function useResourceTypesManagement(filters: ResourceTypeFilters = {}) {
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchResourceTypes = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()

      if (filters.search) searchParams.append("search", filters.search)
      if (filters.code) searchParams.append("code", filters.code)
      if (filters.active !== null && filters.active !== undefined) {
        searchParams.append("active", filters.active.toString())
      }

      const url = `${ApiEndpoints.backend.resourceTypesList}`

      const response = await fetchWithValidation(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar tipos de recurso: ${response.status}`)
      }

      const data = await response.json()
      const resourceTypesData = Array.isArray(data) ? data : data.data || []
      setResourceTypes(resourceTypesData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar tipos de recurso"
      setError(errorMessage)
      setResourceTypes([])
      toast({
        title: "Erro ao carregar tipos de recurso",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [filters, toast])

  useEffect(() => {
    fetchResourceTypes()
  }, [fetchResourceTypes])

  return {
    resourceTypes,
    isLoading,
    error,
    refetch: fetchResourceTypes,
  }
}
