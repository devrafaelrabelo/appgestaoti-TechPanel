"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Eye, Edit, Lock, Unlock, RotateCcw, MoreHorizontal,
  ArrowUpDown, ArrowUp, ArrowDown, ShieldCheck, ShieldX,
  MailCheck, MailX, AlertTriangle
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { AdminUser, AdminUserFiltersType } from "@/types/admin-user"

interface AdminUserTableProps {
  users: AdminUser[]
  selectedIds: Set<string>
  onSelectionChange: (selectedIds: Set<string>) => void
  onViewUser: (user: AdminUser) => void
  onEditUser: (userId: string) => void
  onToggleLock: (userId: string, locked: boolean) => void
  onResetPassword: (userId: string) => void
  filters: AdminUserFiltersType
  onSortChange: (field: string) => void
}

export function AdminUserTable({
  users,
  selectedIds = new Set<string>(),
  onSelectionChange,
  onViewUser,
  onEditUser,
  onToggleLock,
  onResetPassword,
  filters,
  onSortChange,
}: AdminUserTableProps) {
  const [confirmAction, setConfirmAction] = useState<{
    type: "lock" | "unlock" | "reset-password"
    userId: string
    userName: string
  } | null>(null)

  const handleSelectAll = (checked: boolean) => {
    if (checked) onSelectionChange(new Set(users.map((u) => u.id)))
    else onSelectionChange(new Set())
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    const next = new Set(selectedIds ?? new Set<string>())
    if (checked) next.add(userId)
    else next.delete(userId)
    onSelectionChange(next)
  }

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return "—"
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR })
    } catch {
      return "—"
    }
  }

  const getSortIcon = (field: string) =>
    filters.sort !== field ? <ArrowUpDown className="h-4 w-4" /> :
    filters.direction === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />

  const getStatusBadge = (status: AdminUser["status"] | string | undefined) => {
    const map: Record<string, { label: string; className: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      ACTIVE: { label: "ACTIVE", className: "bg-green-100 text-green-800", variant: "default" },
      INACTIVE: { label: "INACTIVE", className: "bg-gray-100 text-gray-800", variant: "secondary" },
      SUSPENDED: { label: "SUSPENDED", className: "bg-red-100 text-red-800", variant: "destructive" },
      PENDING: { label: "PENDING", className: "bg-yellow-100 text-yellow-800", variant: "outline" },
      active: { label: "ACTIVE", className: "bg-green-100 text-green-800", variant: "default" },
      inactive: { label: "INACTIVE", className: "bg-gray-100 text-gray-800", variant: "secondary" },
      suspended: { label: "SUSPENDED", className: "bg-red-100 text-red-800", variant: "destructive" },
      pending: { label: "PENDING", className: "bg-yellow-100 text-yellow-800", variant: "outline" },
    }
    const key = typeof status === "string" ? status : "PENDING"
    const cfg = map[key] ?? map["PENDING"]
    return <Badge variant={cfg.variant} className={cfg.className}>{cfg.label}</Badge>
  }

  const selectedCount = selectedIds?.size ?? 0
  const allSelected = users.length > 0 && selectedCount === users.length
  const someSelected = selectedCount > 0 && selectedCount < users.length

  const handleConfirmAction = () => {
    if (!confirmAction) return
    if (confirmAction.type === "lock") onToggleLock(confirmAction.userId, true)
    if (confirmAction.type === "unlock") onToggleLock(confirmAction.userId, false)
    if (confirmAction.type === "reset-password") onResetPassword(confirmAction.userId)
    setConfirmAction(null)
  }

  return (
    // 🔹 Wrapper controla SOMENTE o scroll horizontal da tabela
    <div className="w-full min-w-0 rounded-md border overflow-x-auto">
      {/* 🔹 min-w garante que a tabela force scroll horizontal dentro do wrapper (não no layout todo) */}
      <Table className="w-full min-w-[1280px] table-fixed">
        <TableHeader>
          <TableRow>
            {/* Seleção */}
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                ref={(el) => { if (el) el.indeterminate = someSelected }}
                onCheckedChange={handleSelectAll}
                aria-label="Selecionar todos"
              />
            </TableHead>
            {/* Ações */}
            <TableHead className="w-12 text-right">Ações</TableHead>

            {/* Username */}
            <TableHead className="min-w-[160px]">
              <Button variant="ghost" onClick={() => onSortChange("username")} className="h-auto p-0 font-semibold hover:bg-transparent inline-flex items-center gap-1">
                Username {getSortIcon("username")}
              </Button>
            </TableHead>

            {/* Full Name */}
            <TableHead className="min-w-[220px]">
              <Button variant="ghost" onClick={() => onSortChange("fullName")} className="h-auto p-0 font-semibold hover:bg-transparent inline-flex items-center gap-1">
                Full Name {getSortIcon("fullName")}
              </Button>
            </TableHead>

            {/* Email */}
            <TableHead className="min-w-[260px]">
              <Button variant="ghost" onClick={() => onSortChange("email")} className="h-auto p-0 font-semibold hover:bg-transparent inline-flex items-center gap-1">
                Email {getSortIcon("email")}
              </Button>
            </TableHead>

            {/* CPF */}
            <TableHead className="min-w-[140px]">CPF</TableHead>

            {/* Roles */}
            <TableHead className="min-w-[220px]">Roles</TableHead>

            {/* Departments */}
            <TableHead className="min-w-[220px]">Departments</TableHead>

            {/* Position */}
            <TableHead className="min-w-[160px]">Position</TableHead>

            {/* Status */}
            <TableHead className="min-w-[140px]">
              <Button variant="ghost" onClick={() => onSortChange("status")} className="h-auto p-0 font-semibold hover:bg-transparent inline-flex items-center gap-1">
                Status {getSortIcon("status")}
              </Button>
            </TableHead>

            {/* Locked */}
            <TableHead className="min-w-[120px]">Locked</TableHead>

            {/* Two-Factor Enabled */}
            <TableHead className="min-w-[180px]">Two-Factor Enabled</TableHead>

            {/* Email Verified */}
            <TableHead className="min-w-[160px]">Email Verified</TableHead>

            {/* Password Compromised */}
            <TableHead className="min-w-[210px]">Password Compromised</TableHead>

            {/* Created At */}
            <TableHead className="min-w-[170px]">
              <Button variant="ghost" onClick={() => onSortChange("createdAt")} className="h-auto p-0 font-semibold hover:bg-transparent inline-flex items-center gap-1">
                Created At {getSortIcon("createdAt")}
              </Button>
            </TableHead>

            {/* Last Login */}
            <TableHead className="min-w-[170px]">
              <Button variant="ghost" onClick={() => onSortChange("lastLogin")} className="h-auto p-0 font-semibold hover:bg-transparent inline-flex items-center gap-1">
                Last Login {getSortIcon("lastLogin")}
              </Button>
            </TableHead>            
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => {
            const isSelected = selectedIds.has(user.id)

            return (
              <TableRow key={user.id} className={isSelected ? "bg-muted/50" : ""}>
                {/* Seleção */}
                <TableCell className="align-middle">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                    aria-label={`Selecionar ${user.fullName}`}
                  />
                </TableCell>
                {/* Ações */}
                <TableCell className="align-middle text-right whitespace-nowrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onViewUser(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditUser(user.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          setConfirmAction({
                            type: user.locked ? "unlock" : "lock",
                            userId: user.id,
                            userName: user.fullName,
                          })
                        }
                      >
                        {user.locked ? (
                          <>
                            <Unlock className="mr-2 h-4 w-4" />
                            Desbloquear
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Bloquear
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setConfirmAction({
                            type: "reset-password",
                            userId: user.id,
                            userName: user.fullName,
                          })
                        }
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Resetar Senha
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                {/* Username */}
                <TableCell className="align-middle whitespace-nowrap truncate max-w-[160px] font-medium">
                  {user.username}
                </TableCell>

                {/* Full Name */}
                <TableCell className="align-middle whitespace-nowrap truncate max-w-[220px]">
                  {user.fullName}
                </TableCell>

                {/* Email */}
                <TableCell className="align-middle truncate max-w-[260px]">
                  {user.email}
                </TableCell>

                {/* CPF */}
                <TableCell className="align-middle whitespace-nowrap font-mono text-xs">
                  {(user as any).cpf ?? "—"}
                </TableCell>

                {/* Roles */}
                <TableCell className="align-middle">
                  {user.roles?.length ? (
                    <div className="flex gap-1 max-w-[220px] overflow-hidden">
                      {user.roles.slice(0, 4).map((r) => (
                        <Badge key={r} variant="outline" className="whitespace-nowrap truncate max-w-[120px]">
                          {r}
                        </Badge>
                      ))}
                      {user.roles.length > 4 && (
                        <Badge variant="outline" className="whitespace-nowrap">+{user.roles.length - 4}</Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* Departments */}
                <TableCell className="align-middle">
                  {user.departments?.length ? (
                    <div className="flex gap-1 max-w-[220px] overflow-hidden">
                      {user.departments.slice(0, 4).map((d) => (
                        <Badge key={d} variant="outline" className="whitespace-nowrap truncate max-w-[120px]">
                          {d}
                        </Badge>
                      ))}
                      {user.departments.length > 4 && (
                        <Badge variant="outline" className="whitespace-nowrap">+{user.departments.length - 4}</Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* Position */}
                <TableCell className="align-middle whitespace-nowrap truncate max-w-[160px]">
                  {user.position ?? "—"}
                </TableCell>

                {/* Status */}
                <TableCell className="align-middle whitespace-nowrap">
                  {getStatusBadge(user.status)}
                </TableCell>

                {/* Locked */}
                <TableCell className="align-middle whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    {user.locked ? (
                      <>
                        <Lock className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-700">Yes</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">No</span>
                      </>
                    )}
                  </div>
                </TableCell>

                {/* Two-Factor Enabled */}
                <TableCell className="align-middle whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    {user.twoFactorEnabled ? (
                      <>
                        <ShieldCheck className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-700">Yes</span>
                      </>
                    ) : (
                      <>
                        <ShieldX className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">No</span>
                      </>
                    )}
                  </div>
                </TableCell>

                {/* Email Verified */}
                <TableCell className="align-middle whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    {user.emailVerified ? (
                      <>
                        <MailCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">Yes</span>
                      </>
                    ) : (
                      <>
                        <MailX className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">No</span>
                      </>
                    )}
                  </div>
                </TableCell>

                {/* Password Compromised */}
                <TableCell className="align-middle whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    {user.passwordCompromised ? (
                      <>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-700">Yes</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-600">No</span>
                    )}
                  </div>
                </TableCell>

                {/* Created At */}
                <TableCell className="align-middle whitespace-nowrap">
                  {formatDateTime(user.createdAt)}
                </TableCell>

                {/* Last Login */}
                <TableCell className="align-middle whitespace-nowrap">
                  {formatDateTime(user.lastLogin)}
                </TableCell>                
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Dialog de Confirmação */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === "lock" && "Bloquear Usuário"}
              {confirmAction?.type === "unlock" && "Desbloquear Usuário"}
              {confirmAction?.type === "reset-password" && "Resetar Senha"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === "lock" &&
                `Tem certeza que deseja bloquear o usuário "${confirmAction.userName}"? O usuário não conseguirá mais fazer login no sistema.`}
              {confirmAction?.type === "unlock" &&
                `Tem certeza que deseja desbloquear o usuário "${confirmAction.userName}"? O usuário poderá fazer login novamente no sistema.`}
              {confirmAction?.type === "reset-password" &&
                `Tem certeza que deseja resetar a senha do usuário "${confirmAction.userName}"? Uma nova senha temporária será enviada por e-mail.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              {confirmAction?.type === "lock" && "Bloquear"}
              {confirmAction?.type === "unlock" && "Desbloquear"}
              {confirmAction?.type === "reset-password" && "Resetar Senha"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
