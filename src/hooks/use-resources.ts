"use client"

import { useState, useEffect, useCallback } from "react"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import type {
  Resource,
  ResourceFilters,
  ResourceStatus,
  ResourceType,
  SpringPageResponse,
  ResourceFormData,
} from "@/types/resource"
import { useToast } from "@/components/ui/use-toast"

export function useResources(initialFilters: ResourceFilters = {}) {
  const [resources, setResources] = useState<Resource[]>([])
  const [filters, setFilters] = useState<ResourceFilters>({
    page: 0,
    size: 20,
    ...initialFilters,
  })
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    size: 20,
    first: true,
    last: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchResources = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()

      if (filters.search) searchParams.append("search", filters.search)
      if (filters.brand) searchParams.append("brand", filters.brand)
      if (filters.status) searchParams.append("status", filters.status)
      if (filters.type) searchParams.append("type", filters.type)
      if (filters.location) searchParams.append("location", filters.location)
      if (filters.currentUser) searchParams.append("currentUser", filters.currentUser)
      if (filters.company) searchParams.append("company", filters.company)
      if (filters.page !== undefined) searchParams.append("page", filters.page.toString())
      if (filters.size !== undefined) searchParams.append("size", filters.size.toString())

      const url = `${ApiEndpoints.backend.resourcesList}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`

      const response = await fetchWithValidation(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar recursos: ${response.status}`)
      }

      const data = await response.json()

      // Verifica se a resposta tem a estrutura do Spring Boot
      if (data.content && Array.isArray(data.content)) {
        const springResponse = data as SpringPageResponse<Resource>
        setResources(springResponse.content)
        setPagination({
          totalElements: springResponse.totalElements,
          totalPages: springResponse.totalPages,
          currentPage: springResponse.number,
          size: springResponse.size,
          first: springResponse.first,
          last: springResponse.last,
        })
      } else {
        // Fallback para estrutura simples
        const resourcesData = Array.isArray(data) ? data : data.data || []
        setResources(resourcesData)
        setPagination({
          totalElements: resourcesData.length,
          totalPages: 1,
          currentPage: 0,
          size: resourcesData.length,
          first: true,
          last: true,
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar recursos"
      setError(errorMessage)
      setResources([])
      setPagination({
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        size: 20,
        first: true,
        last: true,
      })
      toast({
        title: "Erro ao carregar recursos",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [filters, toast])

  const updateFilters = useCallback((newFilters: Partial<ResourceFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset page when filters change (except when only page changes)
      page: newFilters.page !== undefined ? newFilters.page : 0,
    }))
  }, [])

  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  const changePageSize = useCallback((size: number) => {
    setFilters((prev) => ({ ...prev, size, page: 0 }))
  }, [])

  const createResource = useCallback(
    async (data: ResourceFormData): Promise<Resource> => {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.resourcesCreate}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao criar recurso: ${response.status}`)
      }

      const newResource = await response.json()

      toast({
        title: "Recurso criado",
        description: "O recurso foi criado com sucesso.",
      })

      // Atualiza a lista
      fetchResources()

      return newResource
    },
    [fetchResources, toast],
  )

  const updateResource = useCallback(
    async (id: string, data: ResourceFormData): Promise<Resource> => {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.resourcesIdAlter}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao atualizar recurso: ${response.status}`)
      }

      const updatedResource = await response.json()

      toast({
        title: "Recurso atualizado",
        description: "O recurso foi atualizado com sucesso.",
      })

      // Atualiza a lista
      fetchResources()

      return updatedResource
    },
    [fetchResources, toast],
  )

  const deleteResource = useCallback(
    async (id: string): Promise<void> => {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.resourcesIdDelete}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao excluir recurso: ${response.status}`)
      }

      toast({
        title: "Recurso excluído",
        description: "O recurso foi excluído com sucesso.",
      })

      // Atualiza a lista
      fetchResources()
    },
    [fetchResources, toast],
  )

  const getResourceById = useCallback(async (id: string): Promise<Resource> => {
    const response = await fetchWithValidation(`${ApiEndpoints.backend.resourcesIdView}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar recurso: ${response.status}`)
    }

    return response.json()
  }, [])

  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  return {
    resources,
    filters,
    pagination,
    isLoading,
    error,
    refetch: fetchResources,
    updateFilters,
    changePage,
    changePageSize,
    createResource,
    updateResource,
    deleteResource,
    getResourceById,
  }
}

export function useResourceStatuses() {
  const [statuses, setStatuses] = useState<ResourceStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchStatuses = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetchWithValidation(ApiEndpoints.backend.resourceStatusesList, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar status: ${response.status}`)
      }

      const data = await response.json()
      const statusesData = Array.isArray(data) ? data : data.data || []
      setStatuses(statusesData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar status"
      setError(errorMessage)
      setStatuses([])
      toast({
        title: "Erro ao carregar status",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const createStatus = useCallback(
    async (data: { name: string; description?: string; allowsUsage: boolean }): Promise<ResourceStatus> => {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceStatusesCreate}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao criar status: ${response.status}`)
      }

      const newStatus = await response.json()

      toast({
        title: "Status criado",
        description: "O status foi criado com sucesso.",
      })

      fetchStatuses()

      return newStatus
    },
    [fetchStatuses, toast],
  )

  const updateStatus = useCallback(
    async (id: string, data: { name: string; description?: string; allowsUsage: boolean }): Promise<ResourceStatus> => {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceStatusesIdAlter}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao atualizar status: ${response.status}`)
      }

      const updatedStatus = await response.json()

      toast({
        title: "Status atualizado",
        description: "O status foi atualizado com sucesso.",
      })

      fetchStatuses()

      return updatedStatus
    },
    [fetchStatuses, toast],
  )

  const deleteStatus = useCallback(
    async (id: string): Promise<void> => {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceStatusesIdDelete}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao excluir status: ${response.status}`)
      }

      toast({
        title: "Status excluído",
        description: "O status foi excluído com sucesso.",
      })

      fetchStatuses()
    },
    [fetchStatuses, toast],
  )

  useEffect(() => {
    fetchStatuses()
  }, [fetchStatuses])

  return {
    statuses,
    isLoading,
    error,
    refetch: fetchStatuses,
    createStatus,
    updateStatus,
    deleteStatus,
  }
}

export function useResourceTypes() {
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchResourceTypes = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetchWithValidation(ApiEndpoints.backend.resourceTypesList, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar tipos de recurso: ${response.status}`)
      }

      const data = await response.json()
      const typesData = Array.isArray(data) ? data : data.data || []
      setResourceTypes(typesData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar tipos de recurso"
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
  }, [toast])

  const createResourceType = useCallback(
    async (data: { name: string; description?: string }): Promise<ResourceType> => {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceTypesCreate}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao criar tipo de recurso: ${response.status}`)
      }

      const newType = await response.json()

      toast({
        title: "Tipo de recurso criado",
        description: "O tipo de recurso foi criado com sucesso.",
      })

      fetchResourceTypes()

      return newType
    },
    [fetchResourceTypes, toast],
  )

  const updateResourceType = useCallback(
    async (id: string, data: { name: string; description?: string }): Promise<ResourceType> => {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceTypesIdAlter}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao atualizar tipo de recurso: ${response.status}`)
      }

      const updatedType = await response.json()

      toast({
        title: "Tipo de recurso atualizado",
        description: "O tipo de recurso foi atualizado com sucesso.",
      })

      fetchResourceTypes()

      return updatedType
    },
    [fetchResourceTypes, toast],
  )

  const deleteResourceType = useCallback(
    async (id: string): Promise<void> => {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceTypesIdDelete}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao excluir tipo de recurso: ${response.status}`)
      }

      toast({
        title: "Tipo de recurso excluído",
        description: "O tipo de recurso foi excluído com sucesso.",
      })

      fetchResourceTypes()
    },
    [fetchResourceTypes, toast],
  )

  useEffect(() => {
    fetchResourceTypes()
  }, [fetchResourceTypes])

  return {
    resourceTypes,
    isLoading,
    error,
    refetch: fetchResourceTypes,
    createResourceType,
    updateResourceType,
    deleteResourceType,
  }
}
