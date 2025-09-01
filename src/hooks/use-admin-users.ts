"use client"

import { useState, useEffect, useCallback } from "react"
import { ApiEndpoints } from "@/lib/api-endpoints"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import type { AdminUser, AdminUserFiltersType } from "@/types/admin-user"

interface PaginationData {
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

interface AdminUsersResponse {
  content: AdminUser[]
  pagination: PaginationData
  totalElements: number
  totalPages: number
  size: number
  number: number
}''

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationData>({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true
  })

  const [filters, setFilters] = useState<AdminUserFiltersType>({
    search: "",
    department: "",
    role: "",
    status: "",
    dateFrom: "",
    dateTo: ""
  })

  const fetchUsers = useCallback(async (page = 0, size = 10, currentFilters = filters) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(currentFilters.search && { search: currentFilters.search }),
        ...(currentFilters.department && { department: currentFilters.department }),
        ...(currentFilters.role && { role: currentFilters.role }),
        ...(currentFilters.status && { status: currentFilters.status }),
        ...(currentFilters.dateFrom && { dateFrom: currentFilters.dateFrom }),
        ...(currentFilters.dateTo && { dateTo: currentFilters.dateTo })
      })

      const response = await fetchWithValidation(`${ApiEndpoints.backend.adminUsers}?${params}`)

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data: AdminUsersResponse = await response.json()

      // Normalizar dados da resposta
      const usersData = data.content || data || []
      const paginationData = {
        page: data.number || page,
        size: data.size || size,
        totalElements: data.totalElements || usersData.length,
        totalPages: data.totalPages || Math.ceil((data.totalElements || usersData.length) / size),
        first: data.number === 0,
        last: data.number >= (data.totalPages - 1)
      }

      setUsers(usersData)
      setPagination(paginationData)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar usuários"
      setError(errorMessage)
      console.error("Erro ao buscar usuários:", err)
      
      // Definir valores padrão em caso de erro
      setUsers([])
      setPagination({
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true
      })
    } finally {
      setLoading(false)
    }
  }, [filters])

  const updateFilters = useCallback((newFilters: Partial<AdminUserFiltersType>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    fetchUsers(0, pagination.size, updatedFilters)
  }, [filters, pagination.size, fetchUsers])

  const changePage = useCallback((newPage: number) => {
    fetchUsers(newPage, pagination.size)
  }, [fetchUsers, pagination.size])

  const changePageSize = useCallback((newSize: number) => {
    fetchUsers(0, newSize)
  }, [fetchUsers])

  const refreshUsers = useCallback(() => {
    fetchUsers(pagination.page, pagination.size)
  }, [fetchUsers, pagination.page, pagination.size])



  const toggleUserStatus = useCallback(async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.adminUsersIdToggleStatus}${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ active: !currentStatus })
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      // Atualizar o usuário na lista local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, active: !currentStatus }
            : user
        )
      )

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao alterar status do usuário"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  const resetPassword = useCallback(async (userId: string) => {
    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.adminUsersIdResetPassword}${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, temporaryPassword: data.temporaryPassword }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao resetar senha"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  const deleteUser = useCallback(async (userId: string) => {
    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.adminUsers}/${userId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      // Remover usuário da lista local
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
      
      // Atualizar contadores
      setPagination(prev => ({
        ...prev,
        totalElements: prev.totalElements - 1
      }))

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao excluir usuário"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  // Carregar dados iniciais
  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    loading,
    error,
    pagination,
    filters,
    fetchUsers,
    updateFilters,
    changePage,
    changePageSize,
    refreshUsers,
    toggleUserStatus,
    resetPassword,
    deleteUser,
    setError
  }
}
