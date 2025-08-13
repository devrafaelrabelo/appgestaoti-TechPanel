"use client"

import { useState, useEffect, useCallback } from "react"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import type {
  Role,
  RoleDetail,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleFilters,
  RoleStats,
  Permission,
} from "@/types/role"

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoles = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetchWithValidation(ApiEndpoints.backend.adminRoles)
      if (!response.ok) {
        throw new Error("Erro ao carregar roles")
      }

      const data = await response.json()
      setRoles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchRoleById = useCallback(async (id: string): Promise<RoleDetail> => {
    const response = await fetchWithValidation(`${ApiEndpoints.backend.adminRoleId}${id}`)
    if (!response.ok) {
      throw new Error("Erro ao carregar role")
    }

    const role = await response.json()
    return role
  }, [])

  const fetchPermissions = useCallback(async () => {
    try {
      const response = await fetchWithValidation(ApiEndpoints.backend.adminPermissionsList)
      if (!response.ok) {
        throw new Error("Erro ao carregar permissões")
      }

      const data = await response.json()
      setPermissions(data)
    } catch (err) {
      console.error("Erro ao carregar permissões:", err)
    }
  }, [])

  const createRole = useCallback(async (roleData: CreateRoleRequest): Promise<Role> => {
    const response = await fetchWithValidation(ApiEndpoints.backend.adminRoleCreate, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roleData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Erro ao criar role")
    }

    const newRole = await response.json()
    setRoles((prev) => [...prev, newRole])
    return newRole
  }, [])

  const updateRole = useCallback(async (id: string, roleData: UpdateRoleRequest): Promise<Role> => {
    const response = await fetchWithValidation(`${ApiEndpoints.backend.adminRoleIdAlter}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roleData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Erro ao atualizar role")
    }

    const updatedRole = await response.json()
    setRoles((prev) => prev.map((role) => (role.id === id ? updatedRole : role)))
    return updatedRole
  }, [])

  const deleteRole = useCallback(async (id: string): Promise<void> => {
    const response = await fetchWithValidation(`${ApiEndpoints.backend.adminRoleIdDelete}${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Erro ao excluir role")
    }

    setRoles((prev) => prev.filter((role) => role.id !== id))
  }, [])

  const getFilteredRoles = useCallback(
    (filters: RoleFilters) => {
      return roles.filter((role) => {
        const matchesSearch =
          !filters.search ||
          role.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          role.description.toLowerCase().includes(filters.search.toLowerCase())

        const matchesSystemRole =
          filters.systemRole === "all" ||
          (filters.systemRole === "true" && role.systemRole) ||
          (filters.systemRole === "false" && !role.systemRole)

        const matchesHasPermissions =
          filters.hasPermissions === "all" ||
          (filters.hasPermissions === "true" && role.permissionCount > 0) ||
          (filters.hasPermissions === "false" && role.permissionCount === 0)

        return matchesSearch && matchesSystemRole && matchesHasPermissions
      })
    },
    [roles],
  )

  const getStats = useCallback((): RoleStats => {
    return {
      total: roles.length,
      systemRoles: roles.filter((role) => role.systemRole).length,
      customRoles: roles.filter((role) => !role.systemRole).length,
      withPermissions: roles.filter((role) => role.permissionCount > 0).length,
    }
  }, [roles])

  useEffect(() => {
    fetchRoles()
    fetchPermissions()
  }, [fetchRoles, fetchPermissions])

  return {
    roles,
    permissions,
    isLoading,
    error,
    createRole,
    updateRole,
    deleteRole,
    fetchRoleById,
    getFilteredRoles,
    getStats,
    refetch: fetchRoles,
  }
}
