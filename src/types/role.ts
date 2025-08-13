export interface Role {
  id: string
  name: string
  description: string
  systemRole: boolean
  permissionCount: number
}

export interface RoleDetail {
  id: string
  name: string
  description: string
  systemRole: boolean
  permissions: Permission[]
  permissionCount: number
}

export interface Permission {
  id: string
  name: string
  description: string
  resource?: string
  action?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateRoleRequest {
  name: string
  description: string
  systemRole: boolean
  permissionIds: string[]
}

export interface UpdateRoleRequest {
  name: string
  description: string
  systemRole: boolean
  permissionIds: string[]
}

export interface RoleFilters {
  search: string
  systemRole: "all" | "true" | "false"
  hasPermissions: "all" | "true" | "false"
}

export interface RoleStats {
  total: number
  systemRoles: number
  customRoles: number
  withPermissions: number
}

export interface GroupedPermissions {
  [resource: string]: Permission[]
}

// Função helper para extrair recurso e ação do nome da permissão
export function parsePermissionName(name: string): { resource: string; action: string } {
  const parts = name.split(":")
  if (parts.length === 2) {
    return { resource: parts[0], action: parts[1] }
  }
  return { resource: "outros", action: name }
}
