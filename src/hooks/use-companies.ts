"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import type { Company, CreateCompanyData, UpdateCompanyData, CompanyFiltersType } from "@/types/company"

export interface UseCompaniesReturn {
  companies: Company[]
  loading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  totalPages: number

  // Actions
  fetchCompanies: (filters?: CompanyFiltersType, page?: number) => Promise<void>
  createCompany: (data: CreateCompanyData) => Promise<Company | null>
  updateCompany: (id: string, data: UpdateCompanyData) => Promise<Company | null>
  deleteCompany: (id: string) => Promise<boolean>
  toggleCompanyStatus: (id: string, active: boolean) => Promise<boolean>

  // Validation
  validateCNPJ: (cnpj: string, excludeId?: string) => Promise<boolean>
}

export function useCompanies(): UseCompaniesReturn {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const { toast } = useToast()

  const fetchCompanies = async (filters: CompanyFiltersType = {}, page = 1) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      if (filters.search) params.append("search", filters.search)
      if (filters.active !== undefined) params.append("active", filters.active.toString())
      if (filters.state) params.append("state", filters.state)
      if (filters.city) params.append("city", filters.city)

      params.append("page", page.toString())
      params.append("limit", "10")

      const response = await fetchWithValidation(`${ApiEndpoints.backend.adminCompanyList}?${params.toString()}`, {
        method: "GET",
      })

      if (response.ok) {
        const data = await response.json()
        setCompanies(data.companies || [])
        setTotalCount(data.totalCount || 0)
        setCurrentPage(data.currentPage || 1)
        setTotalPages(data.totalPages || 1)
      } else {
        throw new Error("Erro ao carregar empresas")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createCompany = async (data: CreateCompanyData): Promise<Company | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchWithValidation(ApiEndpoints.backend.adminCompanyCreate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const newCompany = await response.json()
        setCompanies((prev) => [newCompany, ...prev])
        setTotalCount((prev) => prev + 1)

        toast({
          title: "Sucesso",
          description: "Empresa criada com sucesso",
        })

        return newCompany
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao criar empresa")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateCompany = async (id: string, data: UpdateCompanyData): Promise<Company | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.adminCompanyIdAlter}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedCompany = await response.json()
        setCompanies((prev) => prev.map((company) => (company.id === id ? updatedCompany : company)))

        toast({
          title: "Sucesso",
          description: "Empresa atualizada com sucesso",
        })

        return updatedCompany
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao atualizar empresa")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteCompany = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.adminCompanyIdDelete}/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCompanies((prev) => prev.filter((company) => company.id !== id))
        setTotalCount((prev) => prev - 1)

        toast({
          title: "Sucesso",
          description: "Empresa excluída com sucesso",
        })

        return true
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao excluir empresa")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const toggleCompanyStatus = async (id: string, active: boolean): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.adminCompanyIdAssign}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active }),
      })

      if (response.ok) {
        const updatedCompany = await response.json()
        setCompanies((prev) => prev.map((company) => (company.id === id ? updatedCompany : company)))

        toast({
          title: "Sucesso",
          description: `Empresa ${active ? "ativada" : "desativada"} com sucesso`,
        })

        return true
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao alterar status da empresa")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const validateCNPJ = async (cnpj: string, excludeId?: string): Promise<boolean> => {
    try {
      const params = new URLSearchParams()
      params.append("cnpj", cnpj)
      if (excludeId) params.append("excludeId", excludeId)

      const response = await fetchWithValidation(
        `${ApiEndpoints.backend.companies}/validate-cnpj?${params.toString()}`,
        {
          method: "GET",
        },
      )

      if (response.ok) {
        const data = await response.json()
        return data.isValid
      }

      return false
    } catch (err) {
      console.error("Erro ao validar CNPJ:", err)
      return false
    }
  }

  // Carregar empresas na inicialização
  useEffect(() => {
    fetchCompanies()
  }, [])

  return {
    companies,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    toggleCompanyStatus,
    validateCNPJ,
  }
}
