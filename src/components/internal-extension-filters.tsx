"use client"

import { StandardFilters, type FilterField } from "@/components/common/standard-filters"
import { Phone, Settings, Search } from "lucide-react"
import { EXTENSION_APPLICATIONS, type InternalExtensionFilters } from "@/types/internal-extension"

interface InternalExtensionFiltersProps {
  filters: InternalExtensionFilters
  onFiltersChange: (filters: InternalExtensionFilters) => void
  onClearFilters: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const filterFields: FilterField[] = [
  {
    key: "search",
    label: "Buscar Ramais",
    type: "search",
    placeholder: "Ramal, aplicação...",
    icon: Search,
  },
  {
    key: "extension",
    label: "Número do Ramal",
    type: "text",
    placeholder: "Ex: 1234",
    icon: Phone,
  },
  {
    key: "application",
    label: "Aplicação",
    type: "select",
    icon: Settings,
    options: EXTENSION_APPLICATIONS.map((app) => ({
      value: app,
      label: app,
    })),
  },
]

export function InternalExtensionFiltersComponent({
  filters,
  onFiltersChange,
  onClearFilters,
  isCollapsed,
  onToggleCollapse,
}: InternalExtensionFiltersProps) {
  return (
    <StandardFilters
      title="Filtros de Ramais Internos"
      subtitle="Filtre ramais por número, aplicação e outros critérios"
      filters={filters}
      fields={filterFields}
      onFiltersChange={onFiltersChange}
      onClearFilters={onClearFilters}
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
      gridCols={3}
    />
  )
}
