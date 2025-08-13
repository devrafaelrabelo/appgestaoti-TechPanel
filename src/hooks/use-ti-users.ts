import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import type { UserInterface } from "@/components/ti-user-table"

interface TiUserFilters {
  search?: string
  status?: string
  role?: string
  department?: string
}

interface TiUserStats {
  total: number
  active: number
  inactive: number
  blocked: number
  suspended: number
  pending: number
  twoFactorEnabled: number
  emailVerified: number
}

export function useTiUsers() {
  const [users, setUsers] = useState<UserInterface[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TiUserFilters>({})
  const [stats, setStats] = useState<TiUserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    blocked: 0,
    suspended: 0,
    pending: 0,
    twoFactorEnabled: 0,
    emailVerified: 0,
  })

  const { toast } = useToast()

  const calculateStats = useCallback((userList: UserInterface[]) => {
    const newStats: TiUserStats = {
      total: userList.length,
      active: userList.filter(u => u.isActive === true).length,
      inactive: userList.filter(u => u.isActive === false).length,
      blocked: userList.filter(u => u.role === 'blocked').length,
      suspended: userList.filter(u => u.role === 'suspended').length,
      pending: userList.filter(u => u.role === 'pending').length,
      twoFactorEnabled: userList.filter(u => u.role === 'twoFactor').length,
      emailVerified: userList.filter(u => u.email && u.email.includes('@')).length,
    }
    setStats(newStats)
  }, [])

  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    
    setError(null)

    try {
      const queryParams = new URLSearchParams()
      
      if (filters.search) {
        queryParams.append('search', filters.search)
      }
      if (filters.status) {
        queryParams.append('status', filters.status)
      }
      if (filters.role) {
        queryParams.append('role', filters.role)
      }
      if (filters.department) {
        queryParams.append('department', filters.department)
      }

      const url = `${ApiEndpoints.backend.adminUsersList}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response = await fetchWithValidation(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao carregar usuários")
      }

      const data = await response.json()
      
      // Normalizar dados da API para o formato esperado
      const normalizedUsers: UserInterface[] = data.map((user: any) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        role: user.roles?.[0] || 'user',
        isActive: user.status === 'ACTIVE',
        department: user.departments?.[0] || 'Não definido',
        accessLevel: 1,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      }))

      setUsers(normalizedUsers)
      calculateStats(normalizedUsers)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      
      toast({
        title: "Erro ao Carregar Usuários",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [filters, toast, calculateStats])

  const refreshUsers = useCallback(() => {
    fetchUsers(true)
  }, [fetchUsers])

  const exportUsers = useCallback(async () => {
    try {
      const response = await fetchWithValidation(ApiEndpoints.users.export, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao exportar usuários")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Exportação Concluída",
        description: "Arquivo CSV baixado com sucesso.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao exportar"
      
      toast({
        title: "Erro na Exportação",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [toast])

  // Carregar usuários na inicialização
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    loading,
    refreshing,
    error,
    filters,
    setFilters,
    refreshUsers,
    exportUsers,
    stats,
  }
}
