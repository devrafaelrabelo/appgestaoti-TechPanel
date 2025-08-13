"use client"

import { useState, useEffect, useCallback } from "react"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import type {
  Permission,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  PermissionFilters,
  PermissionStats,
} from "@/types/permission"

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPermissions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetchWithValidation(ApiEndpoints.backend.adminPermissionsList)
      if (!response.ok) {
        throw new Error("Erro ao carregar permissões")
      }

      const data = await response.json()
      // Normalizar dados vindos da API
      const normalizedData = Array.isArray(data) ? data : []
      const permissionsWithDefaults = normalizedData.map((permission: any) => ({
        ...permission,
        resource: permission.resource || "",
        action: permission.action || "",
        name: permission.name || "",
        description: permission.description || "",
      }))
      setPermissions(permissionsWithDefaults)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createPermission = useCallback(async (permissionData: CreatePermissionRequest): Promise<Permission> => {
    const response = await fetchWithValidation(ApiEndpoints.backend.adminPermissionsCreate, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(permissionData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Erro ao criar permissão")
    }

    const newPermission = await response.json()
    const normalizedPermission = {
      ...newPermission,
      resource: newPermission.resource || "",
      action: newPermission.action || "",
      name: newPermission.name || "",
      description: newPermission.description || "",
    }
    setPermissions((prev) => [...prev, normalizedPermission])
    return normalizedPermission
  }, [])

  const updatePermission = useCallback(
    async (id: string, permissionData: UpdatePermissionRequest): Promise<Permission> => {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.adminPermissionsIdAlter}${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(permissionData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Erro ao atualizar permissão")
      }

      const updatedPermission = await response.json()
      const normalizedPermission = {
        ...updatedPermission,
        resource: updatedPermission.resource || "",
        action: updatedPermission.action || "",
        name: updatedPermission.name || "",
        description: updatedPermission.description || "",
      }
      setPermissions((prev) => prev.map((permission) => (permission.id === id ? normalizedPermission : permission)))
      return normalizedPermission
    },
    [],
  )

  const deletePermission = useCallback(async (id: string): Promise<void> => {
    const response = await fetchWithValidation(`${ApiEndpoints.backend.adminPermissionsIdDelete}${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Erro ao excluir permissão")
    }

    setPermissions((prev) => prev.filter((permission) => permission.id !== id))
  }, [])

  const getFilteredPermissions = useCallback(
    (filters: PermissionFilters) => {
      return permissions.filter((permission) => {
        const matchesSearch =
          !filters.search ||
          permission.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          permission.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          permission.resource.toLowerCase().includes(filters.search.toLowerCase())

        const matchesResource = filters.resource === "all" || permission.resource === filters.resource

        const matchesAction = filters.action === "all" || permission.action === filters.action

        return matchesSearch && matchesResource && matchesAction
      })
    },
    [permissions],
  )

  const getStats = useCallback((): PermissionStats => {
    const byResource: Record<string, number> = {}
    const byAction: Record<string, number> = {}

    permissions.forEach((permission) => {
      if (permission.resource) {
        byResource[permission.resource] = (byResource[permission.resource] || 0) + 1
      }
      if (permission.action) {
        byAction[permission.action] = (byAction[permission.action] || 0) + 1
      }
    })

    const mostUsedResource =
      Object.entries(byResource).reduce((a, b) => (byResource[a[0]] > byResource[b[0]] ? a : b), ["", 0])[0] || ""
    const mostUsedAction =
      Object.entries(byAction).reduce((a, b) => (byAction[a[0]] > byAction[b[0]] ? a : b), ["", 0])[0] || ""

    return {
      total: permissions.length,
      byResource,
      byAction,
      mostUsedResource,
      mostUsedAction,
    }
  }, [permissions])

  const getUniqueResources = useCallback(() => {
    return Array.from(new Set(permissions.map((p) => p.resource).filter(Boolean))).sort()
  }, [permissions])

  const getUniqueActions = useCallback(() => {
    return Array.from(new Set(permissions.map((p) => p.action).filter(Boolean))).sort()
  }, [permissions])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  return {
    permissions,
    isLoading,
    error,
    createPermission,
    updatePermission,
    deletePermission,
    getFilteredPermissions,
    getStats,
    getUniqueResources,
    getUniqueActions,
    refetch: fetchPermissions,
  }
}
