"use client"

import { StandardFilters } from "@/components/common/standard-filters"
import { Search, UserCheck } from "lucide-react"
import type { DepartmentFilters } from "@/types/department"
import type { FilterField } from "@/components/common/standard-filters"

interface DepartmentFiltersProps {
  filters: DepartmentFilters
  onFiltersChange: (filters: DepartmentFilters) => void
  onClear: () => void
}

export function DepartmentFiltersComponent({ filters = {}, onFiltersChange, onClear }: DepartmentFiltersProps) {
  const filterFields: FilterField[] = [
    {
      key: "search",
      label: "Buscar",
      type: "search",
      placeholder: "Nome ou descrição...",
      searchPlaceholder: "Digite para buscar departamentos...",
      icon: Search,
    },
    {
      key: "managerId",
      label: "Gerente",
      type: "select",
      placeholder: "Selecionar status",
      icon: UserCheck,
      options: [
        { value: "with-manager", label: "Com gerente" },
        { value: "without-manager", label: "Sem gerente" },
      ],
    },
  ]

  // Converter os filtros para o formato esperado pelo StandardFilters
  const standardFilters: Record<string, string> = {
    search: filters?.search || "",
    managerId: filters?.managerId || "",
  }

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    const convertedFilters: DepartmentFilters = {}

    // Converter apenas valores não vazios
    if (newFilters.search && newFilters.search.trim()) {
      convertedFilters.search = newFilters.search.trim()
    }

    if (newFilters.managerId && newFilters.managerId.trim()) {
      convertedFilters.managerId = newFilters.managerId.trim()
    }

    onFiltersChange(convertedFilters)
  }

  return (
    <StandardFilters
      title="Filtros de Departamentos"
      subtitle="Use os filtros abaixo para encontrar departamentos específicos"
      filters={standardFilters}
      fields={filterFields}
      onFiltersChange={handleFiltersChange}
      onClearFilters={onClear}
      gridCols={2}
      showActiveCount={true}
      showClearButton={true}
    />
  )
}
