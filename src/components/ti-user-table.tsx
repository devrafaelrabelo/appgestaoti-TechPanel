"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { MoreHorizontal, Eye, Edit, Trash2, Shield, Crown, Settings, User, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'

export interface UserInterface {
  id: string
  fullName: string | null
  email: string
  username: string
  role?: string
  isActive?: boolean
  department?: string
  accessLevel?: number
  lastLogin?: string | null
  createdAt?: string
}

interface TiUserTableProps {
  users: UserInterface[]
  loading?: boolean
  onRefresh?: () => void
  selectedIds?: Set<string>
  onSelectionChange?: (selectedIds: Set<string>) => void
  onViewUser?: (user: UserInterface) => void
  onEditUser?: (userId: string) => void
  onDeleteUser?: (userId: string) => void
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
          <User className="h-3 w-3" />
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
const formatDate = (dateString?: string | null) => {
  if (!dateString) return "Nunca"

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  } catch {
    return "Data inválida"
  }
}

export function TiUserTable({
  users,
  loading = false,
  onRefresh,
  selectedIds = new Set(),
  onSelectionChange,
  onViewUser,
  onEditUser,
  onDeleteUser,
}: TiUserTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  const handleSelectAll = (checked: boolean) => {
    if (onSelectionChange) {
      if (checked) {
        onSelectionChange(new Set(users.map((user) => user.id)))
      } else {
        onSelectionChange(new Set())
      }
    }
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (onSelectionChange) {
      const newSelectedIds = new Set(selectedIds)
      if (checked) {
        newSelectedIds.add(userId)
      } else {
        newSelectedIds.delete(userId)
      }
      onSelectionChange(newSelectedIds)
    }
  }

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (userToDelete && onDeleteUser) {
      onDeleteUser(userToDelete)
    }
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  const isAllSelected = users.length > 0 && selectedIds.size === users.length
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < users.length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Carregando usuários...</p>
            <p className="text-sm text-muted-foreground">Por favor, aguarde</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {onSelectionChange && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Selecionar todos"
                    className={isIndeterminate ? "data-[state=checked]:bg-primary" : ""}
                  />
                </TableHead>
              )}
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Login</TableHead>
              <TableHead className="w-12">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={onSelectionChange ? 8 : 7} className="text-center py-8 text-muted-foreground">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  {onSelectionChange && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                        aria-label={`Selecionar ${user.fullName || user.username}`}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{getInitials(user.fullName)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.fullName || <span className="text-muted-foreground">(Nome não informado)</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{user.department || "Não definido"}</div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {formatDate(user.lastLogin)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {onViewUser && (
                          <DropdownMenuItem onClick={() => onViewUser(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                        )}
                        {onEditUser && (
                          <DropdownMenuItem onClick={() => onEditUser(user.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        {onDeleteUser && (
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(user.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
