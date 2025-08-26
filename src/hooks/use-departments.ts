"use client"

import { useState, useEffect, useCallback } from "react"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import { useToast } from "@/components/ui/use-toast"
import type {
  Department,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
  DepartmentFilters,
  DepartmentStats,
} from "@/types/departments"

interface UseDepartmentsReturn {
  departments: Department[]
  loading: boolean
  error: string | null
  stats: DepartmentStats
  filters: DepartmentFilters
  setFilters: (filters: DepartmentFilters) => void
  createDepartment: (data: CreateDepartmentPayload) => Promise<void>
  updateDepartment: (data: UpdateDepartmentPayload & { id: string }) => Promise<void>
  deleteDepartment: (id: string) => Promise<void>
  refreshDepartments: () => Promise<void>
}

export function useDepartments(): UseDepartmentsReturn {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DepartmentStats>({
    total: 0,
    withManager: 0,
    withoutManager: 0,
  })
  const [filters, setFilters] = useState<DepartmentFilters>({})
  const { toast } = useToast()

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (filters.search) queryParams.append("search", filters.search)
      if (filters.managerId) queryParams.append("managerId", filters.managerId)

      const url = `${ApiEndpoints.backend.adminDepartmentList}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

      const response = await fetchWithValidation(url, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Erro ao buscar departamentos")
      }

      const data = await response.json()
      const departmentsList = Array.isArray(data) ? data : data.departments || []
      setDepartments(departmentsList)

      // Calcular estatísticas
      const total = departmentsList.length
      const withManager = departmentsList.filter((dept: Department) => dept.managerId).length
      const withoutManager = total - withManager

      setStats({
        total,
        withManager,
        withoutManager,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      console.error("Erro ao buscar departamentos:", err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const createDepartment = useCallback(
    async (data: CreateDepartmentPayload): Promise<void> => {
      const response = await fetchWithValidation(ApiEndpoints.backend.adminDepartmentCreate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao criar departamento")
      }

      await fetchDepartments()
    },
    [fetchDepartments],
  )

  const updateDepartment = useCallback(
    async (data: UpdateDepartmentPayload & { id: string }): Promise<void> => {
      const { id, ...updateData } = data
      const response = await fetchWithValidation(`${ApiEndpoints.backend.adminDepartmentIdAlter}${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao atualizar departamento")
      }

      await fetchDepartments()
    },
    [fetchDepartments],
  )

  const deleteDepartment = useCallback(
    async (id: string): Promise<void> => {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.adminDepartmentIdDelete}${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao excluir departamento")
      }

      await fetchDepartments()
    },
    [fetchDepartments],
  )

  const refreshDepartments = useCallback(async () => {
    await fetchDepartments()
  }, [fetchDepartments])

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

  return {
    departments,
    loading,
    error,
    stats,
    filters,
    setFilters,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    refreshDepartments,
  }
}
