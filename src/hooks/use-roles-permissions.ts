"use client"

import { useCallback, useEffect, useState } from "react"
import { ApiEndpoints } from "@/lib/api-endpoints"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import type { RoleItem, PermissionItem } from "@/types/admin-user-create"

interface UseRolesPermissionsState {
  roles: RoleItem[]
  permissions: PermissionItem[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useRolesPermissions(): UseRolesPermissionsState {
  const [roles, setRoles] = useState<RoleItem[]>([])
  const [permissions, setPermissions] = useState<PermissionItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [rolesRes, permsRes] = await Promise.all([
        fetchWithValidation(ApiEndpoints.backend.adminRolesList, { method: "GET" }),
        fetchWithValidation(ApiEndpoints.backend.adminPermissionsList, { method: "GET" }),
      ])

      if (!rolesRes.ok) {
        const e = await rolesRes.json().catch(() => ({}))
        throw new Error(e.message || `Erro ${rolesRes.status} ao carregar papéis`)
      }
      if (!permsRes.ok) {
        const e = await permsRes.json().catch(() => ({}))
        throw new Error(e.message || `Erro ${permsRes.status} ao carregar permissões`)
      }

      const rolesJson = await rolesRes.json()
      const permsJson = await permsRes.json()

      setRoles(Array.isArray(rolesJson) ? rolesJson : rolesJson?.items || [])
      setPermissions(Array.isArray(permsJson) ? permsJson : permsJson?.items || [])
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar papéis e permissões"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { roles, permissions, loading, error, reload: load }
}
