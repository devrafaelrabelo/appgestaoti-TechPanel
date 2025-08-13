// Define os tipos para os dados brutos do menu recebidos da API
export interface MenuData {
  permissions: string[]
  menus: RawMenuItem[]
}

export interface RawMenuItem {
  title: string
  icon: string // Nome do ícone Lucide
  submenu: RawSubMenuItem[]
}

export interface RawSubMenuItem {
  label: string
  icon: string // Nome do ícone Lucide
  path: string // Ex: "/solicitar-usuario"
  requiredPermissions: string[]
  actions?: string[]
  systemNames?: string[] // Ex: ["TI", "RH"]
}

// Define os tipos para os dados do menu processados para uso no frontend
export interface ProcessedMenuData {
  userPermissions: string[]
  menus: MenuItem[]
  currentSystem: string | null
}

export interface MenuItem {
  title: string
  icon: string
  submenu: SubMenuItem[]
  hasAnyAccess: boolean
  systemNames?: string[] // Mantido aqui para compatibilidade, mas a lógica principal é no submenu
}

export interface SubMenuItem {
  label: string
  icon: string
  path: string
  requiredPermissions: string[]
  actions?: string[]
  systemNames?: string[]
  hasAccess: boolean
  availableActions: { action: string; hasPermission: boolean }[]
  isVisibleInCurrentSystem: boolean
}
