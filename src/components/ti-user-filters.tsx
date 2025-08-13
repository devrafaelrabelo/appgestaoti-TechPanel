"use client"

import { StandardFilters, type FilterField } from "@/components/common/standard-filters"
import { Users, Shield, Building, Hash } from "lucide-react"

export interface TiUserFilters {
  search: string
  profile: string
  status: string
  department: string
  accessLevel: string
}

interface TiUserFiltersProps {
  filters: TiUserFilters
  onFiltersChange: (filters: TiUserFilters) => void
  onClearFilters: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const filterFields: FilterField[] = [
  {
    key: "search",
    label: "Buscar Usuários",
    type: "search",
    placeholder: "Nome, email, username...",
    icon: Users,
  },
  {
    key: "profile",
    label: "Perfil",
    type: "select",
    icon: Shield,
    options: [
      { value: "admin", label: "Administrador" },
      { value: "manager", label: "Gerente" },
      { value: "analyst", label: "Analista" },
      { value: "user", label: "Usuário" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    icon: Shield,
    options: [
      { value: "active", label: "Ativo" },
      { value: "inactive", label: "Inativo" },
      { value: "suspended", label: "Suspenso" },
      { value: "pending", label: "Pendente" },
    ],
  },
  {
    key: "department",
    label: "Departamento",
    type: "select",
    icon: Building,
    options: [
      { value: "ti", label: "Tecnologia da Informação" },
      { value: "rh", label: "Recursos Humanos" },
      { value: "comercial", label: "Comercial" },
      { value: "financeiro", label: "Financeiro" },
      { value: "operacional", label: "Operacional" },
    ],
  },
  {
    key: "accessLevel",
    label: "Nível de Acesso",
    type: "select",
    icon: Hash,
    options: [
      { value: "1", label: "Nível 1" },
      { value: "2", label: "Nível 2" },
      { value: "3", label: "Nível 3" },
      { value: "4", label: "Nível 4" },
      { value: "5", label: "Nível 5" },
    ],
  },
]

export function TiUserFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  isCollapsed,
  onToggleCollapse,
}: TiUserFiltersProps) {
  return (
    <StandardFilters
      title="Filtros de Usuários"
      subtitle="Filtre usuários por perfil, status, departamento e nível de acesso"
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
