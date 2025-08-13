"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Shield, Plus, Users, Settings, Key, AlertCircle } from "lucide-react"
import { useRoles } from "@/hooks/use-roles"
import { RoleFiltersComponent } from "@/components/role-filters"
import { RoleTable } from "@/components/role-table"
import { CreateRoleModal } from "@/components/create-role-modal"
import { EditRoleModal } from "@/components/edit-role-modal"
import { ViewRoleModal } from "@/components/view-role-modal"
import type { Role, RoleFilters } from "@/types/role"

const initialFilters: RoleFilters = {
  search: "",
  systemRole: "all",
  hasPermissions: "all",
}

export default function RolesPage() {
  const [filters, setFilters] = useState<RoleFilters>(initialFilters)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null)
  const [viewingRoleId, setViewingRoleId] = useState<string | null>(null)

  const { toast } = useToast()
  const {
    roles,
    permissions,
    isLoading,
    error,
    createRole,
    updateRole,
    deleteRole,
    fetchRoleById,
    getFilteredRoles,
    getStats,
  } = useRoles()

  const filteredRoles = useMemo(() => getFilteredRoles(filters), [getFilteredRoles, filters])
  const stats = useMemo(() => getStats(), [getStats])

  const handleClearFilters = () => {
    setFilters(initialFilters)
  }

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false)
  }

  const handleEditSuccess = () => {
    setEditingRoleId(null)
  }

  const handleEdit = (role: Role) => {
    setEditingRoleId(role.id)
  }

  const handleView = (role: Role) => {
    setViewingRoleId(role.id)
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Roles
            </h1>
            <p className="text-muted-foreground">Gerencie roles e permissões do sistema</p>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar roles</h3>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Roles
          </h1>
          <p className="text-muted-foreground">Gerencie roles e permissões do sistema</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Role
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Todos os roles do sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles do Sistema</CardTitle>
            <Settings className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.systemRoles}</div>
            <p className="text-xs text-muted-foreground">Roles padrão do sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles Personalizados</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.customRoles}</div>
            <p className="text-xs text-muted-foreground">Roles criados pelos usuários</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Permissões</CardTitle>
            <Key className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.withPermissions}</div>
            <p className="text-xs text-muted-foreground">Roles com permissões atribuídas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <RoleFiltersComponent filters={filters} onFiltersChange={setFilters} onClearFilters={handleClearFilters} />

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Roles</span>
            <Badge variant="secondary">
              {filteredRoles.length} {filteredRoles.length === 1 ? "role" : "roles"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Carregando roles...</span>
            </div>
          ) : (
            <RoleTable roles={filteredRoles} onEdit={handleEdit} onDelete={deleteRole} onView={handleView} />
          )}
        </CardContent>
      </Card>

      {/* Modais */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
        onCreate={createRole}
        permissions={permissions}
      />

      <EditRoleModal
        roleId={editingRoleId}
        isOpen={!!editingRoleId}
        onClose={() => setEditingRoleId(null)}
        onSuccess={handleEditSuccess}
        onUpdate={updateRole}
        onFetchRole={fetchRoleById}
        permissions={permissions}
      />

      <ViewRoleModal
        roleId={viewingRoleId}
        isOpen={!!viewingRoleId}
        onClose={() => setViewingRoleId(null)}
        onFetchRole={fetchRoleById}
        permissions={permissions}
      />
    </div>
  )
}
