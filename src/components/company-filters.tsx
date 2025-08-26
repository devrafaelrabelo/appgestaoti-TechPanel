"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search, X, RotateCcw } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface FilterOption {
  value: string
  label: string
}

export interface FilterField {
  key: string
  label: string
  type: "search" | "select" | "text"
  placeholder?: string
  searchPlaceholder?: string
  icon?: LucideIcon
  options?: FilterOption[]
}

interface StandardFiltersProps {
  title: string
  subtitle?: string
  filters?: Record<string, string>
  fields: FilterField[]
  onFiltersChange: (filters: Record<string, string>) => void
  onClearFilters: () => void
  gridCols?: number
  showActiveCount?: boolean
  showClearButton?: boolean
  loading?: boolean
}

export function StandardFilters({
  title,
  subtitle,
  filters = {},
  fields,
  onFiltersChange,
  onClearFilters,
  gridCols = 4,
  showActiveCount = true,
  showClearButton = true,
  loading = false,
}: StandardFiltersProps) {
  const [localFilters, setLocalFilters] = useState<Record<string, string>>(filters)

  // Contar filtros ativos (excluindo valores vazios e "all")
  const activeFilters = Object.entries(filters || {}).filter(([_, value]) => value && value !== "" && value !== "all")

  const hasActiveFilters = activeFilters.length > 0

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilter = (key: string) => {
    const newFilters = { ...localFilters }
    delete newFilters[key]
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleClearAll = () => {
    setLocalFilters({})
    onClearFilters()
  }

  const renderField = (field: FilterField) => {
    const Icon = field.icon
    const value = localFilters[field.key] || ""

    switch (field.type) {
      case "search":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4" />}
              {field.label}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={field.placeholder}
                value={value}
                onChange={(e) => handleFilterChange(field.key, e.target.value)}
                disabled={loading}
                className="pl-10 pr-8"
              />
              {value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => clearFilter(field.key)}
                  disabled={loading}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        )

      case "select":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4" />}
              {field.label}
            </label>
            <Select
              value={value || "all"}
              onValueChange={(newValue) => handleFilterChange(field.key, newValue === "all" ? "" : newValue)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
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
          </div>
        )

      case "text":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4" />}
              {field.label}
            </label>
            <div className="relative">
              <Input
                placeholder={field.placeholder}
                value={value}
                onChange={(e) => handleFilterChange(field.key, e.target.value)}
                disabled={loading}
                className="pr-8"
              />
              {value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => clearFilter(field.key)}
                  disabled={loading}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <div>
              <div className="flex items-center gap-2">
                {title}
                {showActiveCount && hasActiveFilters && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFilters.length} ativo{activeFilters.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              {subtitle && <p className="text-sm text-muted-foreground font-normal mt-1">{subtitle}</p>}
            </div>
          </div>
          {showClearButton && hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={handleClearAll} disabled={loading}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridCols} gap-4`}>
          {(fields ?? []).map((field) => (
            <div key={field.key}>{renderField(field)}</div>
          ))}
        </div>

        {/* Filtros Ativos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {activeFilters.map(([key, value]) => {
              const field = fields.find((f) => f.key === key)
              const label = field?.label || key

              // Para selects, mostrar o label da opção
              let displayValue = value
              if (field?.type === "select" && field.options) {
                const option = field.options.find((opt) => opt.value === value)
                displayValue = option?.label || value
              }

              return (
                <Badge key={key} variant="secondary" className="gap-1">
                  {label}: {displayValue}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => clearFilter(key)}
                    disabled={loading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
