"use client"

import { useCallback, useEffect, useState } from "react"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"

export type AdminUsersStats = {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  lockedAccounts: number
  pendingDeletion: number
}

const defaultStats: AdminUsersStats = {
  totalUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  lockedAccounts: 0,
  pendingDeletion: 0,
}

/**
 * Fetches admin users stats from the backend endpoint.
 * It prefers ApiEndpoints.backend.adminUsersStats (if available) and
 * falls back to NEXT_PUBLIC_API_BASE_URL/admin/users/stats.
 */
export function useAdminUsersStats() {
  const [stats, setStats] = useState<AdminUsersStats>(defaultStats)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const getStatsUrl = (): string => {
    const fromApiEndpoints =
      (ApiEndpoints as any)?.backend?.adminUsersStats as string | undefined
    if (fromApiEndpoints) return fromApiEndpoints

    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    return `${base}/admin/users/stats`
  }

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const url = getStatsUrl()
      const res = await fetchWithValidation(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`)
      }

      const data = (await res.json()) as Partial<AdminUsersStats>
      setStats({
        totalUsers: Number(data.totalUsers ?? 0),
        activeUsers: Number(data.activeUsers ?? 0),
        inactiveUsers: Number(data.inactiveUsers ?? 0),
        lockedAccounts: Number(data.lockedAccounts ?? 0),
        pendingDeletion: Number(data.pendingDeletion ?? 0),
      })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar estatísticas"
      setError(message)
      setStats(defaultStats)
      // eslint-disable-next-line no-console
      console.error("Erro ao buscar estatísticas de usuários:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, loading, error, refresh: fetchStats }
}
