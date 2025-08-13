import {
  Users,
  User,
  Package,
  CreditCard,
  MoreHorizontal,
  Phone,
  PhoneForwarded,
  ShieldCheck,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"

// Mapeamento de strings para componentes de ícones
const iconMap: Record<string, LucideIcon> = {
  Users: Users,
  User: User,
  Package: Package,
  "Credit-card": CreditCard,
  Multiple: MoreHorizontal,
  Phone: Phone,
  "Phone-forwarded": PhoneForwarded,
  "Shield-check": ShieldCheck,
  ChevronRight: ChevronRight,
}

interface DynamicIconProps {
  name: string
  className?: string
}

export function DynamicIcon({ name, className = "h-5 w-5" }: DynamicIconProps) {
  const IconComponent = iconMap[name] || Package // Fallback para Package se não encontrar

  return <IconComponent className={className} />
}
