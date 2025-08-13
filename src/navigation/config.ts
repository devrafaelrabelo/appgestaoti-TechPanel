// Define system types
export type SystemId =
  | "COMERCIAL"
  | "RH"
  | "TI"
  | "FINANCEIRO" // Adicionando os que você listou
  | "OPERACIONAL"
  | "MARKETING"
  | "JURIDICO"
  | "FISCAL"
  | "CONTABIL"
  | "ALMOXARIFADO"
  | "none"

// Interface simplificada para itens de navegação (se necessário no futuro)
export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  // icon?: keyof typeof LucideIcons // Removido pois LucideIcons não está importado e não há uso visível
  label?: string
  description?: string
}

// Interface de configuração de sistema simplificada
export interface SystemConfig {
  id: SystemId
  name: string
  description: string
  homePath: string // Mantendo homePath para consistência com getSystemFromPath
}

// Configuração principal dos sistemas, agora simplificada.
// Usando a estrutura que você forneceu como base e adaptando para homePath.
export const SYSTEMS_CONFIG: Record<Exclude<SystemId, "none">, SystemConfig> = {
  TI: {
    id: "TI",
    name: "TI",
    description: "Módulo de Tecnologia da Informação.",
    homePath: "/ti",
  },
  RH: {
    id: "RH",
    name: "RH",
    description: "Módulo de Recursos Humanos.",
    homePath: "/rh",
  },
  COMERCIAL: {
    id: "COMERCIAL",
    name: "Comercial",
    description: "Módulo Comercial.",
    homePath: "/comercial",
  }
}

export const SYSTEMS_CONFIG_WITH_NONE: Record<
  SystemId,
  SystemConfig | { id: "none"; name: string; description: string; homePath: string }
> = {
  ...SYSTEMS_CONFIG,
  none: {
    id: "none",
    name: "Nenhum Sistema",
    description: "Selecione um sistema para começar.",
    homePath: "/modules",
  },
}

// Obter todos os sistemas disponíveis para seleção
export const AVAILABLE_SYSTEMS: SystemConfig[] = Object.values(SYSTEMS_CONFIG)

// Função para obter o sistema atual com base no caminho (ainda útil para layouts e cabeçalhos)
export function getSystemFromPath(
  path: string,
): SystemConfig | { id: "none"; name: string; description: string; homePath: string } {
  // Ordena os sistemas pelo comprimento do homePath em ordem decrescente para encontrar a correspondência mais específica primeiro
  const sortedSystems = [...AVAILABLE_SYSTEMS].sort((a, b) => b.homePath.length - a.homePath.length)

  const system = sortedSystems.find((s) => path.startsWith(s.homePath))

  if (system) {
    return SYSTEMS_CONFIG_WITH_NONE[system.id]
  }
  return SYSTEMS_CONFIG_WITH_NONE.none
}
