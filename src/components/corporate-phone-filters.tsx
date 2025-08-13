"use client"

import { StandardFilters, type FilterField } from "@/components/common/standard-filters"
import { Phone, Tag, MapPin, AlertCircle, MessageCircle } from "lucide-react"
import { CARRIERS, PLAN_TYPES, PHONE_STATUS, type CorporatePhoneFiltersType } from "@/types/corporate-phone"

interface CorporatePhoneFiltersProps {
  filters: CorporatePhoneFiltersType
  onFiltersChange: (filters: CorporatePhoneFiltersType) => void
  onClearFilters: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const filterFields: FilterField[] = [
  {
    key: "search",
    label: "Buscar Telefones",
    type: "search",
    placeholder: "Número, operadora...",
    icon: Phone,
  },
  {
    key: "carrier",
    label: "Operadora",
    type: "select",
    icon: Tag,
    options: CARRIERS.map((carrier) => ({
      value: carrier.value,
      label: carrier.label,
    })),
  },
  {
    key: "planType",
    label: "Tipo de Plano",
    type: "select",
    icon: MapPin,
    options: PLAN_TYPES.map((plan) => ({
      value: plan.value,
      label: plan.label,
    })),
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    icon: AlertCircle,
    options: PHONE_STATUS.map((status) => ({
      value: status.value,
      label: status.label,
    })),
  },
  {
    key: "whatsappBlock",
    label: "WhatsApp",
    type: "select",
    icon: MessageCircle,
    options: [
      { value: "false", label: "Liberado" },
      { value: "true", label: "Bloqueado" },
    ],
  },
]

export function CorporatePhoneFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  isCollapsed,
  onToggleCollapse,
}: CorporatePhoneFiltersProps) {
  return (
    <StandardFilters
      title="Filtros de Telefones Corporativos"
      subtitle="Filtre telefones por operadora, plano, status e WhatsApp"
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
