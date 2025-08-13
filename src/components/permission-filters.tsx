"use client"

import { StandardFilters, type FilterField } from "@/components/common/standard-filters"
import { Search, Shield, Zap } from "lucide-react"
import type { PermissionFilters } from "@/types/permission"

interface PermissionFiltersProps {
  filters: PermissionFilters
  onFiltersChange: (filters: PermissionFilters) => void
  onClearFilters: () => void
  resources: string[]
  actions: string[]
}

export function PermissionFiltersComponent({
  filters,
  onFiltersChange,
  onClearFilters,
  resources,
  actions,
}: PermissionFiltersProps) {
  const filterFields: FilterField[] = [
    {
      key: "search",
      label: "Buscar",
      type: "search",
      placeholder: "Buscar por nome, descrição ou recurso...",
      icon: Search,
    },
    {
      key: "resource",
      label: "Recurso",
      type: "select",
      placeholder: "Selecionar recurso",
      icon: Shield,
      options: resources
        .filter(Boolean) // Remove valores vazios/undefined
        .map((resource) => ({
          value: resource,
          label: resource && resource.length > 0 ? resource.charAt(0).toUpperCase() + resource.slice(1) : resource,
        })),
    },
    {
      key: "action",
      label: "Ação",
      type: "select",
      placeholder: "Selecionar ação",
      icon: Zap,
      options: actions
        .filter(Boolean) // Remove valores vazios/undefined
        .map((action) => ({
          value: action,
          label: action && action.length > 0 ? action.charAt(0).toUpperCase() + action.slice(1) : action,
        })),
    },
  ]

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    onFiltersChange(newFilters as PermissionFilters)
  }

  return (
    <StandardFilters
      title="Filtros de Permissões"
      subtitle="Use os filtros abaixo para encontrar permissões específicas"
      filters={filters}
      fields={filterFields}
      onFiltersChange={handleFiltersChange}
      onClearFilters={onClearFilters}
      gridCols={3}
    />
  )
}
