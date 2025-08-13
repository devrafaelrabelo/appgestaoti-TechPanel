"use client"

import { StandardFilters, type FilterField } from "@/components/common/standard-filters"
import { Package, Tag, MapPin, AlertCircle } from "lucide-react"

export interface ResourceFilters {
  search: string
  type: string
  status: string
  location: string
  condition: string
}

interface ResourceFiltersProps {
  filters: ResourceFilters
  onFiltersChange: (filters: ResourceFilters) => void
  onClearFilters: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const filterFields: FilterField[] = [
  {
    key: "search",
    label: "Buscar Recursos",
    type: "search",
    placeholder: "Nome, código, descrição...",
    icon: Package,
  },
  {
    key: "type",
    label: "Tipo de Recurso",
    type: "select",
    icon: Tag,
    options: [
      { value: "hardware", label: "Hardware" },
      { value: "software", label: "Software" },
      { value: "network", label: "Rede" },
      { value: "mobile", label: "Dispositivo Móvel" },
      { value: "peripheral", label: "Periférico" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    icon: AlertCircle,
    options: [
      { value: "available", label: "Disponível" },
      { value: "in_use", label: "Em Uso" },
      { value: "maintenance", label: "Manutenção" },
      { value: "retired", label: "Aposentado" },
    ],
  },
  {
    key: "location",
    label: "Localização",
    type: "select",
    icon: MapPin,
    options: [
      { value: "datacenter", label: "Data Center" },
      { value: "office_floor1", label: "Escritório - 1º Andar" },
      { value: "office_floor2", label: "Escritório - 2º Andar" },
      { value: "warehouse", label: "Almoxarifado" },
      { value: "remote", label: "Remoto" },
    ],
  },
  {
    key: "condition",
    label: "Condição",
    type: "select",
    icon: AlertCircle,
    options: [
      { value: "excellent", label: "Excelente" },
      { value: "good", label: "Boa" },
      { value: "fair", label: "Regular" },
      { value: "poor", label: "Ruim" },
    ],
  },
]

export function ResourceFilterComponent({
  filters,
  onFiltersChange,
  onClearFilters,
  isCollapsed,
  onToggleCollapse,
}: ResourceFiltersProps) {
  return (
    <StandardFilters
      title="Filtros de Recursos"
      subtitle="Filtre recursos por tipo, status, localização e condição"
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
