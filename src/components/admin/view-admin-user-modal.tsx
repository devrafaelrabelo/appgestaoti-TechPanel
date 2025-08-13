"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, XCircle, AlertTriangle, Clock, Shield, Mail, Key, User, Phone, Building, Briefcase, Calendar, LogIn, Globe, Palette, Users, FileText, MapPin, Bell, Languages, LockKeyhole } from 'lucide-react'
import type { AdminUser } from "@/types/admin-user"
import type { UserDetails } from "@/types/user-details"

type UserDetailsLike = Partial<AdminUser> & Partial<UserDetails> & {
  id?: string
  username?: string
  fullName?: string
  email?: string
}

interface ViewAdminUserModalProps {
  user: UserDetailsLike | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewAdminUserModal({ user, open, onOpenChange }: ViewAdminUserModalProps) {
  if (!user) return null

  const safeArray = <T,>(arr?: T[]) => Array.isArray(arr) ? arr : []

  function getStatusBadge(status?: string | null) {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: any; color: string }> = {
      active: { label: "Ativo", variant: "default", icon: CheckCircle, color: "text-green-600" },
      inactive: { label: "Inativo", variant: "secondary", icon: XCircle, color: "text-gray-600" },
      suspended: { label: "Suspenso", variant: "destructive", icon: AlertTriangle, color: "text-red-600" },
      pending: { label: "Pendente", variant: "outline", icon: Clock, color: "text-yellow-600" },
      blocked: { label: "Bloqueado", variant: "destructive", icon: AlertTriangle, color: "text-red-600" },
      pending_deletion: { label: "Pendente Exclusão", variant: "outline", icon: AlertTriangle, color: "text-orange-600" }
    }
    const key = typeof status === "string" ? status.toLowerCase() : "inactive"
    const config = statusMap[key] ?? { label: String(status ?? "Desconhecido"), variant: "outline" as const, icon: AlertTriangle, color: "text-gray-600" }
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    )
  }

  function getRoleBadge(role?: string | null) {
    const roleMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; color: string }> = {
      admin: { label: "Administrador", variant: "default", color: "bg-red-100 text-red-800" },
      manager: { label: "Gerente", variant: "secondary", color: "bg-blue-100 text-blue-800" },
      analyst: { label: "Analista", variant: "outline", color: "bg-green-100 text-green-800" },
      user: { label: "Usuário", variant: "outline", color: "bg-gray-100 text-gray-800" },
    }
    const key = typeof role === "string" ? role.toLowerCase() : "user"
    const config = roleMap[key] ?? { label: String(role ?? "Desconhecido"), variant: "outline", color: "bg-gray-100 text-gray-800" }
    return (
      <Badge variant={config.variant} className={config.color}>
        <Shield className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getDepartmentLabel = (department?: string | null) => {
    const departmentMap: Record<string, string> = {
      ti: "Tecnologia da Informação",
      rh: "Recursos Humanos",
      comercial: "Comercial",
      financeiro: "Financeiro",
      operacional: "Operacional",
    }
    const key = typeof department === "string" ? department : ""
    return departmentMap[key] || department || "—"
  }

  const getLanguageLabel = (language?: string | null) => {
    const languageMap: Record<string, string> = {
      "pt-BR": "Português (Brasil)",
      "en-US": "English (US)",
      "es-ES": "Español",
    }
    if (!language) return "—"
    return languageMap[language] || language
  }

  const getThemeLabel = (theme?: string | null) => {
    const themeMap: Record<string, string> = {
      light: "Claro",
      dark: "Escuro",
      system: "Sistema",
    }
    if (!theme) return "—"
    return themeMap[theme] || theme
  }

  const BooleanValue = ({ value, trueLabel = "Sim", falseLabel = "Não" }: { value?: boolean; trueLabel?: string; falseLabel?: string }) => {
    const val = !!value
    return (
      <div className="flex items-center gap-2">
        {val ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-600 font-medium">{trueLabel}</span>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-600">{falseLabel}</span>
          </>
        )}
      </div>
    )
  }

  const roles = safeArray(user.roles)
  const departments = safeArray(user.departments)
  const permissions = safeArray(user.permissions)
  const personalPhones = safeArray(user.personalPhoneNumbers)
  const corpPhones = safeArray(user.currentCorporatePhones)
  const internals = safeArray(user.currentInternalExtensions)
  const functions = safeArray(user.functions)

  const mainRole = (user as any).mainRole as string | undefined // legacy support
  const selectedRole = mainRole || roles[0] || "user"
  const mainDepartment = (user as any).mainDepartment as string | undefined // legacy support
  const selectedDepartment = mainDepartment || departments[0]

  const initials = (user.fullName || user.username || "U")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] max-w-[98vw] h-[92vh] max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user.avatar || "/placeholder.svg?height=40&width=40&query=user%20avatar"}
                alt={user.fullName || user.username || "Usuário"}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-bold">{user.fullName || "—"}</div>
              <div className="text-sm text-muted-foreground">{user.position || "—"}</div>
            </div>
          </DialogTitle>
          <DialogDescription>Informações detalhadas do usuário no sistema</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Nome Completo</div>
                  <div className="text-lg font-medium">{user.fullName || "—"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Nome Social</div>
                  <div className="text-lg">{user.socialName || "—"}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Username</div>
                  <div className="text-lg font-mono">{user.username || "—"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    E-mail
                  </div>
                  <div className="text-lg">{user.email || "—"}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">CPF</div>
                  <div className="text-lg font-mono">{user.cpf || "—"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Data de Nascimento</div>
                  <div className="text-lg">
                    {user.birthDate ? new Date(user.birthDate).toLocaleDateString("pt-BR") : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Telefones Pessoais
                  </div>
                  <div className="text-sm">
                    {personalPhones.length > 0 ? personalPhones.join(", ") : "—"}
                  </div>
                </div>
              </div>
              {(corpPhones.length > 0 || internals.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Telefones Corporativos</div>
                    <div className="text-sm">{corpPhones.length > 0 ? corpPhones.join(", ") : "—"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Ramal Interno</div>
                    <div className="text-sm">{internals.length > 0 ? internals.join(", ") : "—"}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações Profissionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Informações Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Cargo</div>
                  <div className="text-lg font-medium">{user.position || "—"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    Departamento Principal
                  </div>
                  <div className="text-lg">{getDepartmentLabel(selectedDepartment)}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Papel Principal no Sistema</div>
                  <div className="mt-1">{getRoleBadge(selectedRole)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="mt-1">{getStatusBadge(user.status)}</div>
                </div>
              </div>
              {functions.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Funções</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {functions.map((fn, i) => (
                      <Badge key={i} variant="outline">{fn}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status de Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LockKeyhole className="h-5 w-5" />
                Status de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Usuário Bloqueado</div>
                  <div className="mt-1">
                    <BooleanValue value={user.locked} trueLabel="Bloqueado" falseLabel="Desbloqueado" />
                  </div>
                  {user.locked && user.accountSuspendedReason && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                      <div className="font-medium">Motivo do bloqueio:</div>
                      <div>{user.accountSuspendedReason}</div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">E-mail Verificado</div>
                  <div className="mt-1">
                    <BooleanValue value={user.emailVerified} trueLabel="Verificado" falseLabel="Não Verificado" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Autenticação 2FA</div>
                  <div className="mt-1">
                    <BooleanValue value={user.twoFactorEnabled} trueLabel="Habilitado" falseLabel="Desabilitado" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Primeiro Login</div>
                  <div className="mt-1">
                    <BooleanValue value={user.firstLogin} trueLabel="Pendente" falseLabel="Concluído" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Senha Comprometida</div>
                  <div className="mt-1">
                    <BooleanValue value={user.passwordCompromised} trueLabel="Comprometida" falseLabel="Segura" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Última Alteração de Senha</div>
                  <div className="text-lg">
                    {user.passwordLastUpdated
                      ? new Date(user.passwordLastUpdated).toLocaleDateString("pt-BR")
                      : "Nunca alterada"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferências e Configurações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Preferências do Usuário
              </CardTitle>
              {(user.preferredLanguage || user.interfaceTheme || user.timezone || user.notificationsEnabled) && (
                <CardDescription>Preferências de interface e notificações</CardDescription>
              )}
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Languages className="h-3 w-3" />
                    Idioma Preferido
                  </div>
                  <div className="text-lg">{getLanguageLabel(user.preferredLanguage)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Palette className="h-3 w-3" />
                    Tema da Interface
                  </div>
                  <div className="text-lg">{getThemeLabel(user.interfaceTheme)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Fuso Horário
                  </div>
                  <div className="text-lg">{user.timezone || "—"}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    Notificações
                  </div>
                  <div className="mt-1">
                    <BooleanValue value={user.notificationsEnabled} trueLabel="Ativadas" falseLabel="Desativadas" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status do Convite</div>
                  <div className="text-lg">{user.invitationStatus || "—"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Consentimento de Cookies</div>
                  <div className="text-lg">{user.cookieConsentStatus || "—"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Atividade e Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                Atividade no Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Data de Criação
                  </div>
                  <div className="text-lg">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "—"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.createdAt ? new Date(user.createdAt).toLocaleTimeString("pt-BR") : ""}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Última Atualização</div>
                  <div className="text-lg">
                    {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString("pt-BR") : "—"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.updatedAt ? new Date(user.updatedAt).toLocaleTimeString("pt-BR") : ""}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Forçou Logout em</div>
                  <div className="text-lg">
                    {user.forcedLogoutAt ? new Date(user.forcedLogoutAt).toLocaleDateString("pt-BR") : "—"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.forcedLogoutAt ? new Date(user.forcedLogoutAt).toLocaleTimeString("pt-BR") : ""}
                  </div>
                </div>
              </div>
              {(user.origin || user.lastKnownLocation) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Origem</div>
                    <div className="text-lg">{user.origin || "—"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Última Localização Conhecida
                    </div>
                    <div className="text-lg">{user.lastKnownLocation || "—"}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Permissões e Listas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Permissões
                </CardTitle>
                <CardDescription>Permissões individuais do usuário</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {permissions.length > 0 ? (
                    permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {permission}
                      </Badge>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">Nenhuma permissão individual</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Papéis e Departamentos
                </CardTitle>
                <CardDescription>Listas atuais de papéis e departamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <div className="text-sm font-medium text-muted-foreground">Papéis</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {roles.length > 0 ? roles.map((r, i) => <Badge key={`r-${i}`} variant="secondary">{r}</Badge>) : <span className="text-sm text-muted-foreground">Nenhum papel</span>}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Departamentos</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {departments.length > 0 ? departments.map((d, i) => <Badge key={`d-${i}`} variant="outline">{getDepartmentLabel(d)}</Badge>) : <span className="text-sm text-muted-foreground">Nenhum departamento</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notas/Observações - DTO não define; omitido */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
