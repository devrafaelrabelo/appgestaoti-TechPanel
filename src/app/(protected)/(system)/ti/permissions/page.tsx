"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Key, Plus, Shield, Zap, BarChart3, AlertCircle } from "lucide-react"
import { usePermissions } from "@/hooks/use-permissions"
import { PermissionFiltersComponent } from "@/components/permission-filters"
import { PermissionTable } from "@/components/permission-table"
import { CreatePermissionModal } from "@/components/create-permission-modal"
import { EditPermissionModal } from "@/components/edit-permission-modal"
import { PermissionDetails } from "@/components/permission-details"
import type { Permission, PermissionFilters } from "@/types/permission"

const initialFilters: PermissionFilters = {
  search: "",
  resource: "all",
  action: "all",
}

export default function PermissionsPage() {
  const [filters, setFilters] = useState<PermissionFilters>(initialFilters)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const { toast } = useToast()
  const {
    permissions,
    isLoading,
    error,
    createPermission,
    updatePermission,
    deletePermission,
    getFilteredPermissions,
    getStats,
    getUniqueResources,
    getUniqueActions,
  } = usePermissions()

  const filteredPermissions = useMemo(() => getFilteredPermissions(filters), [getFilteredPermissions, filters])
  const stats = useMemo(() => getStats(), [getStats])
  const uniqueResources = useMemo(() => getUniqueResources(), [getUniqueResources])
  const uniqueActions = useMemo(() => getUniqueActions(), [getUniqueActions])

  const handleClearFilters = () => {
    setFilters(initialFilters)
  }

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false)
  }

  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
    setSelectedPermission(null)
  }

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission)
    setIsEditModalOpen(true)
  }

  const handleView = (permission: Permission) => {
    setSelectedPermission(permission)
    setIsDetailsModalOpen(true)
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Key className="h-8 w-8" />
              Permissões
            </h1>
            <p className="text-muted-foreground">Gerencie permissões do sistema</p>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar permissões</h3>
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
            <Key className="h-8 w-8" />
            Permissões
          </h1>
          <p className="text-muted-foreground">Gerencie permissões do sistema</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Permissão
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Permissões</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Todas as permissões do sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recursos</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{Object.keys(stats.byResource).length}</div>
            <p className="text-xs text-muted-foreground">Recursos diferentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ações</CardTitle>
            <Zap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{Object.keys(stats.byAction).length}</div>
            <p className="text-xs text-muted-foreground">Ações diferentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mais Usado</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.byResource[stats.mostUsedResource] || 0}</div>
            <p className="text-xs text-muted-foreground">{stats.mostUsedResource || "N/A"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <PermissionFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
        resources={uniqueResources}
        actions={uniqueActions}
      />

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Permissões</span>
            <Badge variant="secondary">
              {filteredPermissions.length} {filteredPermissions.length === 1 ? "permissão" : "permissões"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Carregando permissões...</span>
            </div>
          ) : (
            <PermissionTable
              permissions={filteredPermissions}
              onEdit={handleEdit}
              onDelete={deletePermission}
              onView={handleView}
            />
          )}
        </CardContent>
      </Card>

      {/* Modais */}
      <CreatePermissionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
        onCreate={createPermission}
      />

      <EditPermissionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedPermission(null)
        }}
        onSuccess={handleEditSuccess}
        onUpdate={updatePermission}
        permission={selectedPermission}
      />

      <PermissionDetails
        permission={selectedPermission}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedPermission(null)
        }}
      />
    </div>
  )
}
