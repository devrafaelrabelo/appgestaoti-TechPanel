"use client"

import { StandardFilters, type FilterField } from "@/components/common/standard-filters"
import { Tag, Folder, Star } from "lucide-react"

export interface ResourceTypeFilters {
  search?: string
  category?: string
  active?: string
  priority?: string
}

interface ResourceTypeFilterComponentProps {
  filters: ResourceTypeFilters
  onFiltersChange: (filters: ResourceTypeFilters) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const filterFields: FilterField[] = [
  {
    key: "search",
    label: "Buscar",
    type: "search",
    placeholder: "Nome ou descrição...",
    icon: Tag,
  },
  {
    key: "category",
    label: "Categoria",
    type: "select",
    icon: Folder,
    options: [
      { value: "hardware", label: "Hardware" },
      { value: "software", label: "Software" },
      { value: "network", label: "Rede" },
      { value: "security", label: "Segurança" },
      { value: "mobile", label: "Mobile" },
    ],
  },
  {
    key: "active",
    label: "Status",
    type: "select",
    icon: Star,
    options: [
      { value: "true", label: "Ativo" },
      { value: "false", label: "Inativo" },
    ],
  },
  {
    key: "priority",
    label: "Prioridade",
    type: "select",
    icon: Star,
    options: [
      { value: "high", label: "Alta" },
      { value: "medium", label: "Média" },
      { value: "low", label: "Baixa" },
    ],
  },
]

export function ResourceTypeFilterComponent({
  filters,
  onFiltersChange,
  isCollapsed,
  onToggleCollapse,
}: ResourceTypeFilterComponentProps) {
  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      category: "all",
      active: "all",
      priority: "all",
    })
  }

  return (
    <StandardFilters
      title="Filtros de Tipos de Recurso"
      filters={filters}
      fields={filterFields}
      onFiltersChange={onFiltersChange}
      onClearFilters={handleClearFilters}
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
      gridCols={2}
    />
  )
}
