"use client"

import { useState, useEffect } from "react"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import type { ResourceStatus, ResourceStatusFilters } from "@/types/resource-status"

export function useResourceStatuses(filters: ResourceStatusFilters = {}) {
  const [statuses, setStatuses] = useState<ResourceStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatuses = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters.search) {
        params.append("search", filters.search)
      }
      if (filters.blocksAllocation !== undefined && filters.blocksAllocation !== null) {
        params.append("blocksAllocation", filters.blocksAllocation.toString())
      }

      const url = `${ApiEndpoints.backend.resourceStatusList}`
      const response = await fetchWithValidation(url)

      if (!response.ok) {
        throw new Error(`Erro ao buscar status: ${response.status}`)
      }

      const data = await response.json()
      setStatuses(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      setStatuses([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStatuses()
  }, [filters.search, filters.blocksAllocation])

  return {
    statuses,
    isLoading,
    error,
    refetch: fetchStatuses,
  }
}
