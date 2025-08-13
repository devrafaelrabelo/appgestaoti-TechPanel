"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/features/common/components/form-field"
import { useForm } from "@/features/common/hooks/use-form"
import { Shield, Key, AlertCircle } from "lucide-react"
import type { CreateRoleRequest, Permission, GroupedPermissions, RoleDetail } from "@/types/role"
import { parsePermissionName } from "@/types/role"

interface RoleFormProps {
  onSubmit: (data: CreateRoleRequest) => Promise<void>
  permissions: Permission[]
  isLoading?: boolean
  initialData?: Partial<RoleDetail> | null
}

const initialFormData: CreateRoleRequest = {
  name: "",
  description: "",
  systemRole: false,
  permissionIds: [],
}

export function RoleForm({ onSubmit, permissions, isLoading = false, initialData }: RoleFormProps) {
  // Se initialData tem permissions (array de objetos), extrair os IDs
  const initialPermissionIds = initialData?.permissions ? initialData.permissions.map((p) => p.id) : []

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(initialPermissionIds)

  // Garantir que initialData tenha valores padrão
  const safeInitialData = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    systemRole: initialData?.systemRole || false,
    permissionIds: initialPermissionIds,
  }

  const { formData, errors, handleChange, handleSubmit, setFormData } = useForm({
    initialData: { ...initialFormData, ...safeInitialData },
    validationRules: {
      name: { required: true, minLength: 2 },
      description: { required: true, minLength: 5 },
    },
    onSubmit: async (data) => {
      await onSubmit({
        ...data,
        permissionIds: selectedPermissions,
      })
    },
  })

  useEffect(() => {
    if (initialData?.permissions) {
      const permissionIds = initialData.permissions.map((p) => p.id)
      setSelectedPermissions(permissionIds)
    }
  }, [initialData])

  // Agrupar permissões por recurso
  const groupedPermissions: GroupedPermissions = permissions.reduce((acc, permission) => {
    const { resource } = parsePermissionName(permission.name)
    const resourceKey = permission.resource || resource || "Outros"

    if (!acc[resourceKey]) {
      acc[resourceKey] = []
    }
    acc[resourceKey].push(permission)
    return acc
  }, {} as GroupedPermissions)

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId],
    )
  }

  const handleSelectAllPermissions = (resource: string) => {
    const resourcePermissions = groupedPermissions[resource]
    const resourcePermissionIds = resourcePermissions.map((p) => p.id)
    const allSelected = resourcePermissionIds.every((id) => selectedPermissions.includes(id))

    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((id) => !resourcePermissionIds.includes(id)))
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...resourcePermissionIds])])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Nome do Role" error={errors.name} required>
            <Input
              name="name"
              value={formData?.name || ""}
              onChange={handleChange}
              placeholder="Ex: ROLE_USER_MANAGER"
              disabled={isLoading}
            />
          </FormField>

          <FormField label="Descrição" error={errors.description} required>
            <Textarea
              name="description"
              value={formData?.description || ""}
              onChange={handleChange}
              placeholder="Descreva as responsabilidades deste role..."
              rows={3}
              disabled={isLoading}
            />
          </FormField>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="systemRole"
              checked={formData?.systemRole || false}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, systemRole: checked as boolean }))}
              disabled={isLoading}
            />
            <label
              htmlFor="systemRole"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Role do Sistema
            </label>
          </div>
          {formData?.systemRole && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                Roles do sistema não podem ser excluídos e têm restrições especiais.
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
            <Badge variant="secondary">{selectedPermissions.length} selecionadas</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedPermissions).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma permissão disponível</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => {
                const allSelected = resourcePermissions.every((p) => selectedPermissions.includes(p.id))

                return (
                  <div key={resource} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">{resource}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectAllPermissions(resource)}
                        disabled={isLoading}
                      >
                        {allSelected ? "Desmarcar Todas" : "Selecionar Todas"}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {resourcePermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            id={permission.id}
                            checked={selectedPermissions.includes(permission.id)}
                            onCheckedChange={() => handlePermissionToggle(permission.id)}
                            disabled={isLoading}
                          />
                          <div className="flex-1 min-w-0">
                            <label
                              htmlFor={permission.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {permission.name}
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Role"}
        </Button>
      </div>
    </form>
  )
}
