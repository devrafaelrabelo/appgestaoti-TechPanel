"use client"

import { useUserPermissions } from "@/features/auth/hooks/use-user-permissions"
import type { ReactNode } from "react"

interface PermissionGuardProps {
  children: ReactNode
  permissions?: string[]
  requireAll?: boolean
  entity?: string
  action?: string
  fallback?: ReactNode
}

/**
 * Componente para proteger elementos baseado em permissões
 *
 * @example
 * // Verificar permissão específica
 * <PermissionGuard permissions={["user:create"]}>
 *   <Button>Criar Usuário</Button>
 * </PermissionGuard>
 *
 * // Verificar entidade:ação
 * <PermissionGuard entity="user" action="create">
 *   <Button>Criar Usuário</Button>
 * </PermissionGuard>
 *
 * // Verificar múltiplas permissões (qualquer uma)
 * <PermissionGuard permissions={["user:create", "user:update"]} requireAll={false}>
 *   <Button>Gerenciar Usuários</Button>
 * </PermissionGuard>
 */
export function PermissionGuard({
  children,
  permissions = [],
  requireAll = true,
  entity,
  action,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission, hasAllPermissions, hasAnyPermission, canPerformAction } = useUserPermissions()

  // Se especificou entity e action, usar canPerformAction
  if (entity && action) {
    if (!canPerformAction(entity, action)) {
      return <>{fallback}</>
    }
    return <>{children}</>
  }

  // Se não tem permissões para verificar, mostrar o conteúdo
  if (permissions.length === 0) {
    return <>{children}</>
  }

  // Verificar permissões
  const hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions)

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
