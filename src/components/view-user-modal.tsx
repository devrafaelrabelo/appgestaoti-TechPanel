"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  User,
  Mail,
  Building,
  Shield,
  Calendar,
  Clock,
  Crown,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import type { UserInterface } from "@/components/ti-user-table"

interface ViewUserModalProps {
  user: UserInterface | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Helper to get initials from fullName
const getInitials = (fullName: string | null) => {
  if (!fullName) return ""
  const parts = fullName.split(" ")
  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() || ""
  }
  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase()
}

// Helper to get role badge
const getRoleBadge = (role?: string) => {
  switch (role) {
    case "admin":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Crown className="h-3 w-3" />
          Admin
        </Badge>
      )
    case "manager":
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          Gerente
        </Badge>
      )
    case "analyst":
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Settings className="h-3 w-3" />
          Analista
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Crown className="h-3 w-3" />
          Usuário
        </Badge>
      )
  }
}

// Helper to get status badge
const getStatusBadge = (isActive?: boolean) => {
  if (isActive === undefined) return null

  return isActive ? (
    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
      <CheckCircle className="h-3 w-3" />
      Ativo
    </Badge>
  ) : (
    <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
      <XCircle className="h-3 w-3" />
      Inativo
    </Badge>
  )
}

// Helper to format date
const formatDate = (dateString?: string) => {
  if (!dateString) return "Nunca"

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return "Data inválida"
  }
}

// Helper to format relative date
const formatRelativeDate = (dateString?: string) => {
  if (!dateString) return "Nunca"

  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Hoje"
    if (diffInDays === 1) return "Ontem"
    if (diffInDays < 7) return `${diffInDays} dias atrás`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} meses atrás`
    return `${Math.floor(diffInDays / 365)} anos atrás`
  } catch {
    return "Data inválida"
  }
}

export function ViewUserModal({ user, open, onOpenChange }: ViewUserModalProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Usuário
          </DialogTitle>
          <DialogDescription>Informações completas do usuário selecionado</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header com Avatar e Info Principal */}
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg font-semibold">{getInitials(user.fullName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="text-xl font-semibold">
                  {user.fullName || <span className="text-muted-foreground">(Nome não informado)</span>}
                </h3>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
              <div className="flex items-center gap-2">
                {getRoleBadge(user.role)}
                {getStatusBadge(user.isActive)}
              </div>
            </div>
          </div>

          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <User className="h-4 w-4" />
                    Nome de Usuário
                  </div>
                  <p className="text-sm font-mono">@{user.username}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Building className="h-4 w-4" />
                    Departamento
                  </div>
                  <p className="text-sm">{user.department || "Não definido"}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Nível de Acesso
                  </div>
                  <div>
                    {user.accessLevel ? (
                      <Badge variant="outline">Nível {user.accessLevel}</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">Não definido</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Acesso */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Informações de Acesso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Data de Criação
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">{formatDate(user.createdAt)}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeDate(user.createdAt)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Último Login
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">{formatDate(user.lastLogin)}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeDate(user.lastLogin)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status e Permissões */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Status e Permissões
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm font-medium">Status da Conta</div>
                </div>
                <div>{getStatusBadge(user.isActive)}</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm font-medium">Perfil de Acesso</div>
                </div>
                <div>{getRoleBadge(user.role)}</div>
              </div>

              {user.accessLevel && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium">Nível de Permissão</div>
                  </div>
                  <div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Nível {user.accessLevel}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  • ID do usuário: <span className="font-mono">{user.id}</span>
                </p>
                <p>• Departamento: {user.department || "Não definido"}</p>
                <p>• Tipo de conta: {user.role === "admin" ? "Administrativa" : "Padrão"}</p>
                {user.lastLogin && <p>• Última atividade: {formatRelativeDate(user.lastLogin)}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
