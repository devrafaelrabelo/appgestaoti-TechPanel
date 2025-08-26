"use client"

import { useState, useEffect, useCallback } from "react"
import type {
  CorporatePhone,
  CreateCorporatePhoneRequest,
  UpdateCorporatePhoneRequest,
  CorporatePhoneFilters,
} from "@/types/corporate-phone"
import { ApiEndpoints } from "@/lib/api-endpoints"
import  fetchWithValidation from "@/features/auth/services/fetch-with-validation"

export function useCorporatePhones() {
  const [corporatePhones, setCorporatePhones] = useState<CorporatePhone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCorporatePhones = useCallback(async (filters?: CorporatePhoneFilters) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (filters?.search) queryParams.append("search", filters.search)
      if (filters?.carrier) queryParams.append("carrier", filters.carrier)
      if (filters?.planType) queryParams.append("planType", filters.planType)
      if (filters?.status) queryParams.append("status", filters.status)
      if (filters?.companyId) queryParams.append("companyId", filters.companyId.toString())
      if (filters?.currentUserId) queryParams.append("currentUserId", filters.currentUserId.toString())

      const url = `${ApiEndpoints.backend.resourceCorporatePhoneList}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

      const response = await fetchWithValidation(url)

      if (!response.ok) {
        throw new Error("Falha ao carregar telefones corporativos")
      }

      const data = await response.json()
      setCorporatePhones(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      setCorporatePhones([])
    } finally {
      setLoading(false)
    }
  }, [])

  const createCorporatePhone = useCallback(
    async (corporatePhoneData: CreateCorporatePhoneRequest): Promise<CorporatePhone> => {
      const response = await fetchWithValidation(ApiEndpoints.backend.resourceCorporatePhoneCreate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(corporatePhoneData),
      })

      if (!response.ok) {
        throw new Error("Falha ao criar telefone corporativo")
      }

      const newCorporatePhone = await response.json()
      setCorporatePhones((prev) => [...prev, newCorporatePhone])
      return newCorporatePhone
    },
    [],
  )

  const updateCorporatePhone = useCallback(
    async (corporatePhoneData: UpdateCorporatePhoneRequest): Promise<CorporatePhone> => {
      const response = await fetchWithValidation(
        `${ApiEndpoints.backend.resourceCorporatePhoneIdAlter}${corporatePhoneData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(corporatePhoneData),
        },
      )

      if (!response.ok) {
        throw new Error("Falha ao atualizar telefone corporativo")
      }

      const updatedCorporatePhone = await response.json()
      setCorporatePhones((prev) =>
        prev.map((phone) => (phone.id === corporatePhoneData.id ? updatedCorporatePhone : phone)),
      )
      return updatedCorporatePhone
    },
    [],
  )

  const deleteCorporatePhone = useCallback(async (id: number): Promise<void> => {
    const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceCorporatePhoneIdDelete}${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Falha ao excluir telefone corporativo")
    }

    setCorporatePhones((prev) => prev.filter((phone) => phone.id !== id))
  }, [])

  const getCorporatePhoneById = useCallback(async (id: number): Promise<CorporatePhone> => {
    const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceCorporatePhoneId}${id}`)

    if (!response.ok) {
      throw new Error("Falha ao carregar telefone corporativo")
    }

    return response.json()
  }, [])

  useEffect(() => {
    fetchCorporatePhones()
  }, [fetchCorporatePhones])

  return {
    corporatePhones,
    loading,
    error,
    fetchCorporatePhones,
    createCorporatePhone,
    updateCorporatePhone,
    deleteCorporatePhone,
    getCorporatePhoneById,
    refetch: fetchCorporatePhones,
  }
}
