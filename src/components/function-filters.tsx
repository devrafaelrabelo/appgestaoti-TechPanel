"use client"

import { useState, useEffect } from "react"
import { Search, Building2, Filter } from "lucide-react"
import { StandardFilters } from "@/components/common/standard-filters"
import type { FunctionFilters } from "@/types/function"
import type { Department } from "@/types/departments"
import fetchWithValidation  from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"

interface FunctionFiltersProps {
  filters: FunctionFilters
  onFiltersChange: (filters: FunctionFilters) => void
}

export function FunctionFiltersComponent({ filters = {}, onFiltersChange }: FunctionFiltersProps) {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loadingDepartments, setLoadingDepartments] = useState(false)

  // Buscar departamentos para o filtro
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true)
      try {
        const response = await fetchWithValidation(ApiEndpoints.backend.adminDepartmentList)
        if (response.ok) {
          const data = await response.json()
          setDepartments(data.departments || [])
        }
      } catch (error) {
        console.error("Erro ao buscar departamentos:", error)
      } finally {
        setLoadingDepartments(false)
      }
    }

    fetchDepartments()
  }, [])

  // Converter os filtros para o formato esperado pelo StandardFilters
  const standardFilters: Record<string, string> = {
    search: filters.search || "",
    departmentId: filters.departmentId || "",
  }

  // Configuração dos campos de filtro
  const filterFields = [
    {
      key: "search",
      label: "Buscar funções",
      placeholder: "Nome ou descrição...",
      icon: Search,
      type: "text" as const,
    },
    {
      key: "departmentId",
      label: "Departamento",
      placeholder: loadingDepartments ? "Carregando..." : "Selecione um departamento",
      icon: Building2,
      type: "select" as const,
      options: [
        { value: "", label: "Todos os departamentos" },
        ...departments.map((dept) => ({
          value: dept.id,
          label: dept.name,
        })),
      ],
      disabled: loadingDepartments,
    },
  ]

  // Manipular mudanças nos filtros
  const handleFiltersChange = (newFilters: Record<string, string>) => {
    const functionFilters: FunctionFilters = {
      search: newFilters.search || undefined,
      departmentId: newFilters.departmentId || undefined,
    }

    // Remove campos vazios
    Object.keys(functionFilters).forEach((key) => {
      if (!functionFilters[key as keyof FunctionFilters]) {
        delete functionFilters[key as keyof FunctionFilters]
      }
    })

    onFiltersChange(functionFilters)
  }

  return (
    <StandardFilters
      title="Filtros de Funções"
      icon={Filter}
      filters={standardFilters}
      fields={filterFields}
      onFiltersChange={handleFiltersChange}
    />
  )
}
