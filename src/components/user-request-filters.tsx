"use client"

import { StandardFilters, type FilterField } from "@/components/common/standard-filters"
import { FileText, Clock, Calendar } from "lucide-react"

export interface UserRequestFilters {
  searchTerm: string
  status: string
  dateFrom: string
  dateTo: string
}

interface UserRequestFiltersComponentProps {
  filters: UserRequestFilters
  onFiltersChange: (filters: UserRequestFilters) => void
  onClearFilters: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const filterFields: FilterField[] = [
  {
    key: "searchTerm",
    label: "Buscar",
    type: "search",
    placeholder: "Nome, CPF ou detalhes...",
    icon: FileText,
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    icon: Clock,
    options: [
      { value: "PENDING", label: "Pendente" },
      { value: "APPROVED", label: "Aprovada" },
      { value: "REJECTED", label: "Rejeitada" },
      { value: "CANCELLED", label: "Cancelada" },
      { value: "CREATED", label: "Criado" },
      { value: "COMPLETED", label: "Concluído" },
    ],
  },
  {
    key: "dateFrom",
    label: "Data Inicial",
    type: "date",
    icon: Calendar,
  },
  {
    key: "dateTo",
    label: "Data Final",
    type: "date",
    icon: Calendar,
  },
]

export function UserRequestFiltersComponent({
  filters,
  onFiltersChange,
  onClearFilters,
  isCollapsed,
  onToggleCollapse,
}: UserRequestFiltersComponentProps) {
  return (
    <StandardFilters
      title="Filtros de Solicitações"
      subtitle="Filtre solicitações por status, período e termo de busca"
      filters={filters}
      fields={filterFields}
      onFiltersChange={onFiltersChange}
      onClearFilters={onClearFilters}
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
      gridCols={4}
    />
  )
}
