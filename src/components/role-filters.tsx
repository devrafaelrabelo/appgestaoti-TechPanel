"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"
import type { RoleFilters } from "@/types/role"

interface RoleFiltersComponentProps {
  filters: RoleFilters
  onFiltersChange: (filters: RoleFilters) => void
  onClearFilters: () => void
}

export function RoleFiltersComponent({ filters, onFiltersChange, onClearFilters }: RoleFiltersComponentProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleSystemRoleChange = (value: string) => {
    onFiltersChange({ ...filters, systemRole: value as "all" | "true" | "false" })
  }

  const handleHasPermissionsChange = (value: string) => {
    onFiltersChange({ ...filters, hasPermissions: value as "all" | "true" | "false" })
  }

  const hasActiveFilters = filters.search || filters.systemRole !== "all" || filters.hasPermissions !== "all"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="ml-auto">
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nome ou descrição..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tipo de Role */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select value={filters.systemRole} onValueChange={handleSystemRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Sistema</SelectItem>
                <SelectItem value="false">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tem Permissões */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Permissões</label>
            <Select value={filters.hasPermissions} onValueChange={handleHasPermissionsChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por permissões" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Com permissões</SelectItem>
                <SelectItem value="false">Sem permissões</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
