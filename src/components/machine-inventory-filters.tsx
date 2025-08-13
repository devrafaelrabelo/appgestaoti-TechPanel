"use client"

import { useState } from "react"
import { Search, Filter, X, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MachineFilters } from "@/types/machine"

interface MachineInventoryFiltersProps {
  filters: MachineFilters
  onFiltersChange: (filters: MachineFilters) => void
  departments: string[]
  antivirusOptions: string[]
  users: string[]
  locations?: string[]
  manufacturers?: string[]
  operatingSystems?: string[]
}

export function MachineInventoryFilters({
  filters,
  onFiltersChange,
  departments,
  antivirusOptions,
  users,
  locations = [],
  manufacturers = [],
  operatingSystems = [],
}: MachineInventoryFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [tagInput, setTagInput] = useState("")

  const updateFilter = (key: keyof MachineFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      department: "all",
      status: "all",
      antivirus: "all",
      user: "all",
      location: "all",
      manufacturer: "all",
      operatingSystem: "all",
      complianceStatus: "all",
      tags: [],
      dateRange: {
        from: "",
        to: "",
      },
    })
  }

  const removeFilter = (key: keyof MachineFilters) => {
    if (key === "tags") {
      updateFilter(key, [])
    } else if (key === "dateRange") {
      updateFilter(key, { from: "", to: "" })
    } else {
      updateFilter(key, "")
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !filters.tags.includes(tagInput.trim())) {
      updateFilter("tags", [...filters.tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    updateFilter(
      "tags",
      filters.tags.filter((tag) => tag !== tagToRemove),
    )
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.department !== "all") count++
    if (filters.status !== "all") count++
    if (filters.antivirus !== "all") count++
    if (filters.user !== "all") count++
    if (filters.location !== "all") count++
    if (filters.manufacturer !== "all") count++
    if (filters.operatingSystem !== "all") count++
    if (filters.complianceStatus !== "all") count++
    if (filters.tags.length > 0) count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="space-y-4">
      {/* Filtros Básicos */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Busca */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por hostname, usuário, IP ou serial..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Departamento */}
        <Select value={filters.department} onValueChange={(value) => updateFilter("department", value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os departamentos</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="online">🟢 Online</SelectItem>
            <SelectItem value="warning">🟡 Alerta</SelectItem>
            <SelectItem value="offline">🔴 Offline</SelectItem>
          </SelectContent>
        </Select>

        {/* Botão Filtros Avançados */}
        <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Avançado
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Limpar Filtros */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={clearAllFilters} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      {/* Filtros Avançados */}
      {showAdvanced && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros Avançados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Usuário */}
              <div className="space-y-2">
                <Label>Usuário</Label>
                <Select value={filters.user} onValueChange={(value) => updateFilter("user", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os usuários</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user} value={user}>
                        {user}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Antivírus */}
              <div className="space-y-2">
                <Label>Antivírus</Label>
                <Select value={filters.antivirus} onValueChange={(value) => updateFilter("antivirus", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar antivírus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {antivirusOptions.map((av) => (
                      <SelectItem key={av} value={av}>
                        {av}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Localização */}
              <div className="space-y-2">
                <Label>Localização</Label>
                <Select value={filters.location} onValueChange={(value) => updateFilter("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar localização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as localizações</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fabricante */}
              <div className="space-y-2">
                <Label>Fabricante</Label>
                <Select value={filters.manufacturer} onValueChange={(value) => updateFilter("manufacturer", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar fabricante" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os fabricantes</SelectItem>
                    {manufacturers.map((manufacturer) => (
                      <SelectItem key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sistema Operacional */}
              <div className="space-y-2">
                <Label>Sistema Operacional</Label>
                <Select
                  value={filters.operatingSystem}
                  onValueChange={(value) => updateFilter("operatingSystem", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar SO" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os sistemas</SelectItem>
                    {operatingSystems.map((os) => (
                      <SelectItem key={os} value={os}>
                        {os}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status de Compliance */}
              <div className="space-y-2">
                <Label>Status de Compliance</Label>
                <Select
                  value={filters.complianceStatus}
                  onValueChange={(value) => updateFilter("complianceStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status de compliance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="compliant">✅ Compliant</SelectItem>
                    <SelectItem value="non-compliant">❌ Não Compliant</SelectItem>
                    <SelectItem value="unknown">❓ Desconhecido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                  className="flex-1"
                />
                <Button onClick={addTag} size="sm">
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros Ativos */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="outline" className="flex items-center gap-1">
              Busca: {filters.search}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("search")} />
            </Badge>
          )}
          {filters.department !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              Depto: {filters.department}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("department")} />
            </Badge>
          )}
          {filters.status !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              Status: {filters.status}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("status")} />
            </Badge>
          )}
          {filters.user !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              Usuário: {filters.user}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("user")} />
            </Badge>
          )}
          {filters.antivirus !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              Antivírus: {filters.antivirus}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("antivirus")} />
            </Badge>
          )}
          {filters.location !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              Local: {filters.location}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("location")} />
            </Badge>
          )}
          {filters.manufacturer !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              Fabricante: {filters.manufacturer}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("manufacturer")} />
            </Badge>
          )}
          {filters.operatingSystem !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              SO: {filters.operatingSystem}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("operatingSystem")} />
            </Badge>
          )}
          {filters.complianceStatus !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              Compliance: {filters.complianceStatus}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("complianceStatus")} />
            </Badge>
          )}
          {filters.tags.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              Tags: {filters.tags.join(", ")}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("tags")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
