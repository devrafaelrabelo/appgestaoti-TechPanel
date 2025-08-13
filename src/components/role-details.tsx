"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Settings, Key, User, AlertTriangle } from "lucide-react"
import type { RoleDetail, Permission, GroupedPermissions } from "@/types/role"
import { parsePermissionName } from "@/types/role"

interface RoleDetailsProps {
  role: RoleDetail | null
  permissions: Permission[]
  isOpen: boolean
  onClose: () => void
}

export function RoleDetails({ role, permissions, isOpen, onClose }: RoleDetailsProps) {
  if (!role) return null

  // Usar as permissões que vêm com o role
  const rolePermissions = role.permissions || []

  // Agrupar permissões por recurso
  const groupedPermissions: GroupedPermissions = rolePermissions.reduce((acc, permission) => {
    // Extrair recurso do nome da permissão se não estiver definido
    const { resource } = parsePermissionName(permission.name)
    const resourceKey = permission.resource || resource || "Outros"

    if (!acc[resourceKey]) {
      acc[resourceKey] = []
    }
    acc[resourceKey].push(permission)
    return acc
  }, {} as GroupedPermissions)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {role.systemRole ? (
              <Settings className="h-5 w-5 text-blue-600" />
            ) : (
              <Shield className="h-5 w-5 text-green-600" />
            )}
            {role.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome</label>
                  <p className="text-sm font-mono bg-muted p-2 rounded">{role.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                  <div className="mt-1">
                    <Badge variant={role.systemRole ? "default" : "secondary"}>
                      {role.systemRole ? "Sistema" : "Personalizado"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                <p className="text-sm mt-1 p-3 bg-muted rounded">{role.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total de Permissões</label>
                  <p className="text-sm font-mono bg-muted p-2 rounded">{role.permissionCount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Permissões Carregadas</label>
                  <p className="text-sm font-mono bg-muted p-2 rounded">{rolePermissions.length}</p>
                </div>
              </div>

              {/* Aviso se há inconsistência */}
              {role.permissionCount > 0 && rolePermissions.length === 0 && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700">
                    Este role deveria ter {role.permissionCount} permissões, mas nenhuma foi carregada.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Permissões */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Permissões
                <Badge variant="secondary">
                  {rolePermissions.length} de {role.permissionCount}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rolePermissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {role.permissionCount > 0
                      ? "As permissões não foram carregadas"
                      : "Este role não possui permissões atribuídas"}
                  </p>
                  {role.permissionCount > 0 && (
                    <p className="text-xs mt-2">Total esperado: {role.permissionCount} permissões</p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                    <div key={resource} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                          {resource}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {resourcePermissions.length}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {resourcePermissions.map((permission) => {
                          const { action } = parsePermissionName(permission.name)
                          return (
                            <div key={permission.id} className="p-3 border rounded-lg bg-muted/30">
                              <div className="font-medium text-sm">{permission.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">{permission.description}</div>
                              <div className="text-xs text-muted-foreground mt-2 font-mono">
                                Ação: {permission.action || action}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
