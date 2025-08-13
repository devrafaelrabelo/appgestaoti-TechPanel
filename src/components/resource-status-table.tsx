"use client"

import { useState } from "react"
import { MoreHorizontal, Eye, Edit, Trash2, Shield, ShieldOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import type { ResourceStatus } from "@/types/resource-status"

interface ResourceStatusTableProps {
  statuses: ResourceStatus[]
  onEdit: (status: ResourceStatus) => void
  onView: (status: ResourceStatus) => void
  onDelete: (statusId: string) => Promise<void>
  onRefresh: () => void
}

export function ResourceStatusTable({ statuses, onEdit, onView, onDelete, onRefresh }: ResourceStatusTableProps) {
  const [deletingStatus, setDeletingStatus] = useState<ResourceStatus | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (status: ResourceStatus) => {
    setDeletingStatus(status)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingStatus) return

    setIsDeleting(true)
    try {
      await onDelete(deletingStatus.id)
      setDeletingStatus(null)
      onRefresh()
    } catch (error) {
      // Erro já tratado no componente pai
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeletingStatus(null)
  }

  if (statuses.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum status encontrado</h3>
        <p className="text-muted-foreground">Não há status cadastrados ou que correspondam aos filtros aplicados.</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Alocação</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statuses.map((status) => (
              <TableRow key={status.id}>
                <TableCell>
                  <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{status.code}</code>
                </TableCell>
                <TableCell className="font-medium">{status.name}</TableCell>
                <TableCell className="max-w-xs truncate" title={status.description}>
                  {status.description}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={status.blocksAllocation ? "destructive" : "default"}
                    className="flex items-center gap-1 w-fit"
                  >
                    {status.blocksAllocation ? (
                      <>
                        <ShieldOff className="h-3 w-3" />
                        Bloqueia
                      </>
                    ) : (
                      <>
                        <Shield className="h-3 w-3" />
                        Permite
                      </>
                    )}
                  </Badge>
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
                      <DropdownMenuItem onClick={() => onView(status)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(status)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(status)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!deletingStatus} onOpenChange={() => !isDeleting && setDeletingStatus(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o status "{deletingStatus?.name}" ({deletingStatus?.code})?
              <br />
              <br />
              Esta ação não pode ser desfeita e pode afetar recursos que utilizam este status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
