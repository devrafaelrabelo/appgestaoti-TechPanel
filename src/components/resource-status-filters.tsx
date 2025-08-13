"use client"

import { StandardFilters, type FilterField } from "@/components/common/standard-filters"
import { Shield, AlertTriangle, Activity } from "lucide-react"

export interface ResourceStatusFilters {
  search?: string
  category?: string
  severity?: string
  allowsUsage?: string
}

interface ResourceStatusFilterComponentProps {
  filters: ResourceStatusFilters
  onFiltersChange: (filters: ResourceStatusFilters) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const filterFields: FilterField[] = [
  {
    key: "search",
    label: "Buscar",
    type: "search",
    placeholder: "Nome ou descrição...",
    icon: Shield,
  },
  {
    key: "category",
    label: "Categoria",
    type: "select",
    icon: Shield,
    options: [
      { value: "operational", label: "Operacional" },
      { value: "maintenance", label: "Manutenção" },
      { value: "security", label: "Segurança" },
      { value: "administrative", label: "Administrativo" },
    ],
  },
  {
    key: "severity",
    label: "Severidade",
    type: "select",
    icon: AlertTriangle,
    options: [
      { value: "critical", label: "Crítica" },
      { value: "high", label: "Alta" },
      { value: "medium", label: "Média" },
      { value: "low", label: "Baixa" },
      { value: "info", label: "Informativa" },
    ],
  },
  {
    key: "allowsUsage",
    label: "Permite Uso",
    type: "select",
    icon: Activity,
    options: [
      { value: "true", label: "Sim" },
      { value: "false", label: "Não" },
    ],
  },
]

export function ResourceStatusFilterComponent({
  filters,
  onFiltersChange,
  isCollapsed,
  onToggleCollapse,
}: ResourceStatusFilterComponentProps) {
  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      category: "all",
      severity: "all",
      allowsUsage: "all",
    })
  }

  return (
    <StandardFilters
      title="Filtros de Status"
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
