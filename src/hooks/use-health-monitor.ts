import { useState, useEffect, useCallback } from 'react'
import fetchWithValidation from '@/features/auth/services/fetch-with-validation'
import { ApiEndpoints } from "@/lib/api-endpoints"
import type { HealthMonitorResponse } from '@/types/health-monitor'

interface UseHealthMonitorOptions {
  autoRefresh?: boolean
  refreshInterval?: number
}

interface UseHealthMonitorReturn {
  data: HealthMonitorResponse | null
  loading: boolean
  refreshing: boolean
  error: string | null
  lastUpdated: Date | null
  refresh: () => Promise<void>
}

export function useHealthMonitor(options: UseHealthMonitorOptions = {}): UseHealthMonitorReturn {
  const { autoRefresh = true, refreshInterval = 30000 } = options
  
  const [data, setData] = useState<HealthMonitorResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchHealthData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      
      setError(null)

      const response = await fetchWithValidation(ApiEndpoints.monitor.health, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados de saúde: ${response.status} ${response.statusText}`)
      }

      const healthData: HealthMonitorResponse = await response.json()
      
      setData(healthData)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      console.error('Erro ao buscar dados de saúde:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao buscar dados de saúde')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  const refresh = useCallback(() => {
    return fetchHealthData(true)
  }, [fetchHealthData])

  // Buscar dados iniciais
  useEffect(() => {
    fetchHealthData()
  }, [fetchHealthData])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      if (!loading && !refreshing) {
        fetchHealthData(true)
      }
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, loading, refreshing, fetchHealthData])

  return {
    data,
    loading,
    refreshing,
    error,
    lastUpdated,
    refresh
  }
}
