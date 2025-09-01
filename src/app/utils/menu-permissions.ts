import type { MenuData, MenuItem, SubMenuItem, ProcessedMenuData, RawMenuItem } from "@/types/menu"

/**
 * Verifica se o usuário tem todas as permissões necessárias
 */
export function hasRequiredPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.every((permission) => userPermissions.includes(permission))
}

/**
 * Verifica quais ações o usuário pode realizar
 */
export function getAvailableActions(userPermissions: string[], actions: string[] = []) {
  return actions.map((action) => ({
    action,
    hasPermission: userPermissions.includes(action),
  }))
}

/**
 * Detecta o sistema atual baseado na URL
 */
export function getCurrentSystem(pathname: string): string | null {
  // O padrão regex foi simplificado para focar na parte relevante da URL
  const match = pathname.match(/^\/(ti|rh|comercial)/i)
  if (match) {
    const system = match[1].toUpperCase()
    return system
  }
  return null
}

/**
 * Constrói o path completo para um submenu baseado no sistema atual
 */
export function buildFullPath(currentSystem: string | null, subItemPath: string): string {
  if (!currentSystem) {
    // Se não há sistema, retorna o path original, que pode ser para uma página global
    return subItemPath
  }
  // Garante que o path do submenu não tenha uma barra inicial para evitar duplicação
  const cleanSubPath = subItemPath.startsWith("/") ? subItemPath.slice(1) : subItemPath
  return `/${currentSystem.toLowerCase()}/${cleanSubPath}`
}

/**
 * Verifica se um path corresponde ao pathname atual, considerando o sistema
 */
export function isPathActive(pathname: string, subItemPath: string, currentSystem: string | null): boolean {
  const fullPath = buildFullPath(currentSystem, subItemPath)
  return pathname === fullPath
}

/**
 * Verifica se o submenu deve ser exibido no sistema atual
 */
export function isSubMenuVisibleInSystem(systemNames: string[] | undefined, currentSystem: string | null): boolean {
  // Se systemNames não for fornecido ou estiver vazio, o item é visível em todos os sistemas.
  if (!systemNames || systemNames.length === 0) {
    return true
  }
  // Se não houver um sistema atual, não mostre itens de menu específicos do sistema.
  if (!currentSystem) {
    return false
  }
  // Verifica se o sistema atual está na lista de systemNames permitidos.
  return systemNames.includes(currentSystem)
}

/**
 * Processa os dados do menu baseado nas permissões do usuário e sistema atual
 */
export function processMenuData(menuData: MenuData, currentSystem: string | null): ProcessedMenuData {
  const { permissions: userPermissions, menus } = menuData

  const processedMenus: MenuItem[] = menus
    .map((menu: RawMenuItem): MenuItem => {
      const processedSubmenu: SubMenuItem[] = menu.submenu
        .map((subItem) => {
          const hasAccess = hasRequiredPermissions(userPermissions, subItem.requiredPermissions)
          const isVisibleInCurrentSystem = isSubMenuVisibleInSystem(subItem.systemNames, currentSystem)

          return {
            ...subItem,
            hasAccess,
            availableActions: getAvailableActions(userPermissions, subItem.actions),
            isVisibleInCurrentSystem,
          }
        })
        .filter((subItem) => subItem.hasAccess && subItem.isVisibleInCurrentSystem)

      return {
        ...menu,
        submenu: processedSubmenu,
        hasAnyAccess: processedSubmenu.length > 0,
      }
    })
    .filter((menu) => menu.hasAnyAccess)

  return {
    userPermissions,
    menus: processedMenus,
    currentSystem,
  }
}
