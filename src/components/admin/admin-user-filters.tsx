"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Filter,
  ChevronDown,
  ChevronRight,
  Search,
  User,
  Shield,
  Building,
  Briefcase,
  Globe,
  Palette,
  Calendar,
  RotateCcw,
} from "lucide-react"
import type { AdminUserFiltersType } from "@/types/admin-user"

interface AdminUserFiltersProps {
  filters: AdminUserFiltersType
  onFiltersChange: (filters: AdminUserFiltersType) => void
  onClearFilters: () => void
}

export function AdminUserFilters({ filters, onFiltersChange, onClearFilters }: AdminUserFiltersProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const handleFilterChange = (key: keyof AdminUserFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 0, // Reset page when filters change
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.nameOrEmail) count++
    if (filters.cpf) count++
    if (filters.status) count++
    if (filters.role) count++
    if (filters.department) count++
    if (filters.position) count++
    if (filters.preferredLanguage) count++
    if (filters.interfaceTheme) count++
    if (filters.locked !== undefined) count++
    if (filters.emailVerified !== undefined) count++
    if (filters.twoFactorEnabled !== undefined) count++
    if (filters.firstLogin !== undefined) count++
    if (filters.passwordCompromised !== undefined) count++
    if (filters.createdFrom) count++
    if (filters.createdTo) count++
    if (filters.lastLoginFrom) count++
    if (filters.lastLoginTo) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filtros
            {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount}</Badge>}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros Básicos - Layout Horizontal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nameOrEmail" className="flex items-center gap-1 text-sm">
              <Search className="h-3 w-3" />
              Nome ou E-mail
            </Label>
            <Input
              id="nameOrEmail"
              placeholder="Buscar..."
              value={filters.nameOrEmail || ""}
              onChange={(e) => handleFilterChange("nameOrEmail", e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf" className="flex items-center gap-1 text-sm">
              <User className="h-3 w-3" />
              CPF
            </Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={filters.cpf || ""}
              onChange={(e) => handleFilterChange("cpf", e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-sm">
              <Shield className="h-3 w-3" />
              Status
            </Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => handleFilterChange("status", value === "all" ? undefined : value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-sm">
              <Shield className="h-3 w-3" />
              Papel
            </Label>
            <Select
              value={filters.role || "all"}
              onValueChange={(value) => handleFilterChange("role", value === "all" ? undefined : value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os papéis</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="manager">Gerente</SelectItem>
                <SelectItem value="analyst">Analista</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-sm">
              <Building className="h-3 w-3" />
              Departamento
            </Label>
            <Select
              value={filters.department || "all"}
              onValueChange={(value) => handleFilterChange("department", value === "all" ? undefined : value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os departamentos</SelectItem>
                <SelectItem value="ti">Tecnologia da Informação</SelectItem>
                <SelectItem value="rh">Recursos Humanos</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="operacional">Operacional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position" className="flex items-center gap-1 text-sm">
              <Briefcase className="h-3 w-3" />
              Cargo
            </Label>
            <Input
              id="position"
              placeholder="Cargo..."
              value={filters.position || ""}
              onChange={(e) => handleFilterChange("position", e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        {/* Filtros Avançados */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2 h-auto">
              <span className="flex items-center gap-2 font-medium">
                <Filter className="h-4 w-4" />
                Filtros Avançados
              </span>
              {advancedOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <Separator />

            {/* Primeira linha de filtros avançados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-sm">
                  <Globe className="h-3 w-3" />
                  Idioma Preferido
                </Label>
                <Select
                  value={filters.preferredLanguage || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("preferredLanguage", value === "all" ? undefined : value)
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os idiomas</SelectItem>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-sm">
                  <Palette className="h-3 w-3" />
                  Tema da Interface
                </Label>
                <Select
                  value={filters.interfaceTheme || "all"}
                  onValueChange={(value) => handleFilterChange("interfaceTheme", value === "all" ? undefined : value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os temas</SelectItem>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3" />
                  Data de Criação - De
                </Label>
                <Input
                  type="date"
                  value={filters.createdFrom || ""}
                  onChange={(e) => handleFilterChange("createdFrom", e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3" />
                  Data de Criação - Até
                </Label>
                <Input
                  type="date"
                  value={filters.createdTo || ""}
                  onChange={(e) => handleFilterChange("createdTo", e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            {/* Segunda linha de filtros avançados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3" />
                  Último Login - De
                </Label>
                <Input
                  type="date"
                  value={filters.lastLoginFrom || ""}
                  onChange={(e) => handleFilterChange("lastLoginFrom", e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3" />
                  Último Login - Até
                </Label>
                <Input
                  type="date"
                  value={filters.lastLoginTo || ""}
                  onChange={(e) => handleFilterChange("lastLoginTo", e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            {/* Checkboxes de Status Booleanos */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Filtros de Status</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="locked"
                    checked={filters.locked === true}
                    onCheckedChange={(checked) => handleFilterChange("locked", checked === true ? true : undefined)}
                  />
                  <Label htmlFor="locked" className="text-sm">
                    Bloqueado
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emailVerified"
                    checked={filters.emailVerified === true}
                    onCheckedChange={(checked) =>
                      handleFilterChange("emailVerified", checked === true ? true : undefined)
                    }
                  />
                  <Label htmlFor="emailVerified" className="text-sm">
                    E-mail Verificado
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="twoFactorEnabled"
                    checked={filters.twoFactorEnabled === true}
                    onCheckedChange={(checked) =>
                      handleFilterChange("twoFactorEnabled", checked === true ? true : undefined)
                    }
                  />
                  <Label htmlFor="twoFactorEnabled" className="text-sm">
                    2FA Habilitado
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="firstLogin"
                    checked={filters.firstLogin === true}
                    onCheckedChange={(checked) => handleFilterChange("firstLogin", checked === true ? true : undefined)}
                  />
                  <Label htmlFor="firstLogin" className="text-sm">
                    Primeiro Login
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="passwordCompromised"
                    checked={filters.passwordCompromised === true}
                    onCheckedChange={(checked) =>
                      handleFilterChange("passwordCompromised", checked === true ? true : undefined)
                    }
                  />
                  <Label htmlFor="passwordCompromised" className="text-sm">
                    Senha Comprometida
                  </Label>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
