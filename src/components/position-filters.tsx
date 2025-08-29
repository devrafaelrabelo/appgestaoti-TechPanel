"use client"

import { Search, Filter } from "lucide-react"
import { StandardFilters } from "@/components/common/standard-filters"
import type { PositionFilters } from "@/types/position"

interface PositionFiltersProps {
  filters: PositionFilters
  onFiltersChange: (filters: PositionFilters) => void
}

export function PositionFiltersComponent({ filters = {}, onFiltersChange }: PositionFiltersProps) {
  // Converter os filtros para o formato esperado pelo StandardFilters
  const standardFilters: Record<string, string> = {
    search: filters.search || "",
  }

  // Configuração dos campos de filtro
  const filterFields = [
    {
      key: "search",
      label: "Buscar posições",
      placeholder: "Nome ou descrição...",
      icon: Search,
      type: "text" as const,
    },
  ]

  // Manipular mudanças nos filtros
  const handleFiltersChange = (newFilters: Record<string, string>) => {
    const positionFilters: PositionFilters = {
      search: newFilters.search || undefined,
    }

    // Remove campos vazios
    Object.keys(positionFilters).forEach((key) => {
      if (!positionFilters[key as keyof PositionFilters]) {
        delete positionFilters[key as keyof PositionFilters]
      }
    })

    onFiltersChange(positionFilters)
  }

  return (
    <StandardFilters
      title="Filtros de Posições"
      icon={Filter}
      filters={standardFilters}
      fields={filterFields}
      onFiltersChange={handleFiltersChange}
    />
  )
}
