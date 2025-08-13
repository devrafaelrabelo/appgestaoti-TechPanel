"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export interface FilterField {
  key: string
  label: string
  type: "search" | "select" | "date"
  placeholder?: string
  searchPlaceholder?: string
  icon?: React.ComponentType<{ className?: string }>
  options?: Array<{ value: string; label: string }>
}

interface StandardFiltersProps {
  title: string
  subtitle?: string
  filters: Record<string, string>
  fields: FilterField[]
  onFiltersChange: (filters: Record<string, string>) => void
  onClearFilters: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  gridCols?: 1 | 2 | 3 | 4 | 5 | 6
  showActiveCount?: boolean
  showClearButton?: boolean
}

export function StandardFilters({
  title,
  subtitle,
  filters,
  fields,
  onFiltersChange,
  onClearFilters,
  isCollapsed = false,
  onToggleCollapse,
  gridCols = 4,
  showActiveCount = true,
  showClearButton = true,
}: StandardFiltersProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(isCollapsed)

  const collapsed = onToggleCollapse ? isCollapsed : internalCollapsed
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed))

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const handleRemoveFilter = (key: string) => {
    onFiltersChange({
      ...filters,
      [key]: "",
    })
  }

  // Contar filtros ativos (excluindo valores vazios e "all")
  const activeFilters = Object.entries(filters).filter(([_, value]) => value && value !== "" && value !== "all")

  const hasActiveFilters = activeFilters.length > 0

  // Gerar classes do grid baseado no número de colunas
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  }

  return (
    <Card>
      <Collapsible open={!collapsed} onOpenChange={() => toggleCollapse()}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center justify-between p-0 h-auto hover:bg-transparent">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-4 w-4" />
                {title}
                {showActiveCount && hasActiveFilters && (
                  <Badge variant="default" className="text-xs">
                    {activeFilters.length}
                  </Badge>
                )}
              </CardTitle>
              {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          {subtitle && !collapsed && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Badges de filtros ativos */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {activeFilters.map(([key, value]) => {
                  const field = fields.find((f) => f.key === key)
                  const displayValue = field?.options?.find((opt) => opt.value === value)?.label || value

                  return (
                    <Badge key={key} variant="secondary" className="flex items-center gap-1">
                      {field?.label}: {displayValue}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1 hover:bg-transparent"
                        onClick={() => handleRemoveFilter(key)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )
                })}
              </div>
            )}

            {/* Campos de filtro */}
            <div className={`grid gap-4 ${gridClasses[gridCols]}`}>
              {fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key} className="flex items-center gap-2">
                    {field.icon && <field.icon className="h-4 w-4" />}
                    {field.label}
                  </Label>

                  {field.type === "search" && (
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id={field.key}
                        placeholder={
                          field.searchPlaceholder || field.placeholder || `Buscar ${field.label.toLowerCase()}...`
                        }
                        value={filters[field.key] || ""}
                        onChange={(e) => handleFilterChange(field.key, e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  )}

                  {field.type === "select" && (
                    <Select
                      value={filters[field.key] || "all"}
                      onValueChange={(value) => handleFilterChange(field.key, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={field.placeholder || `Selecionar ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {field.type === "date" && (
                    <Input
                      id={field.key}
                      type="date"
                      value={filters[field.key] || ""}
                      onChange={(e) => handleFilterChange(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Botão para limpar filtros */}
            {showClearButton && hasActiveFilters && (
              <div className="flex justify-end pt-2">
                <Button variant="outline" size="sm" onClick={onClearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
