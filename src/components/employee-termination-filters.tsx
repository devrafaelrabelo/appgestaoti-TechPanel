"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Filter, RotateCcw } from "lucide-react"
import type { TerminationFilters } from "@/types/employee-termination"
import { TERMINATION_STATUS, PRIORITY_LEVELS, TERMINATION_REASONS } from "@/types/employee-termination"

interface EmployeeTerminationFiltersProps {
  filters: TerminationFilters
  onFiltersChange: (filters: TerminationFilters) => void
  onClearFilters: () => void
  showStatusFilter?: boolean
  availableStatuses?: string[]
}

export function EmployeeTerminationFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  showStatusFilter = true,
  availableStatuses,
}: EmployeeTerminationFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof TerminationFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const removeFilter = (key: keyof TerminationFilters) => {
    onFiltersChange({
      ...filters,
      [key]: "",
    })
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value !== "").length
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Recolher" : "Expandir"}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros Básicos - Sempre Visíveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              placeholder="Nome, CPF, email..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          {showStatusFilter && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {availableStatuses
                    ? availableStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {TERMINATION_STATUS[status as keyof typeof TERMINATION_STATUS]}
                        </SelectItem>
                      ))
                    : Object.entries(TERMINATION_STATUS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="priority">Prioridade</Label>
            <Select value={filters.priority} onValueChange={(value) => handleFilterChange("priority", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as prioridades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as prioridades</SelectItem>
                {Object.entries(PRIORITY_LEVELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Select value={filters.department} onValueChange={(value) => handleFilterChange("department", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os departamentos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os departamentos</SelectItem>
                <SelectItem value="Vendas">Vendas</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Financeiro">Financeiro</SelectItem>
                <SelectItem value="RH">Recursos Humanos</SelectItem>
                <SelectItem value="TI">Tecnologia da Informação</SelectItem>
                <SelectItem value="Operações">Operações</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros Avançados - Mostrados quando expandido */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="terminationReason">Motivo do Desligamento</Label>
              <Select
                value={filters.terminationReason}
                onValueChange={(value) => handleFilterChange("terminationReason", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os motivos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os motivos</SelectItem>
                  {Object.entries(TERMINATION_REASONS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFrom">Data Inicial</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTo">Data Final</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requestedBy">Solicitado Por</Label>
              <Input
                id="requestedBy"
                placeholder="Nome do solicitante"
                value={filters.requestedBy}
                onChange={(e) => handleFilterChange("requestedBy", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Badges de Filtros Ativos */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Busca: {filters.search}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("search")} />
              </Badge>
            )}
            {filters.status && filters.status !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Status: {TERMINATION_STATUS[filters.status as keyof typeof TERMINATION_STATUS]}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("status")} />
              </Badge>
            )}
            {filters.priority && filters.priority !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Prioridade: {PRIORITY_LEVELS[filters.priority as keyof typeof PRIORITY_LEVELS]}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("priority")} />
              </Badge>
            )}
            {filters.department && filters.department !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Departamento: {filters.department}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("department")} />
              </Badge>
            )}
            {filters.terminationReason && filters.terminationReason !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Motivo: {TERMINATION_REASONS[filters.terminationReason as keyof typeof TERMINATION_REASONS]}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("terminationReason")} />
              </Badge>
            )}
            {filters.dateFrom && (
              <Badge variant="secondary" className="gap-1">
                De: {new Date(filters.dateFrom).toLocaleDateString("pt-BR")}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("dateFrom")} />
              </Badge>
            )}
            {filters.dateTo && (
              <Badge variant="secondary" className="gap-1">
                Até: {new Date(filters.dateTo).toLocaleDateString("pt-BR")}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("dateTo")} />
              </Badge>
            )}
            {filters.requestedBy && (
              <Badge variant="secondary" className="gap-1">
                Solicitante: {filters.requestedBy}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("requestedBy")} />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
