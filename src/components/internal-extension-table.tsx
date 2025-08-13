"use client"

import { useState } from "react"
import { MoreHorizontal, Eye, Edit, Trash2, Phone, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InternalExtensionForm } from "./internal-extension-form"
import type { InternalExtension, CreateInternalExtensionData } from "@/types/internal-extension"

interface InternalExtensionTableProps {
  extensions: InternalExtension[]
  onEdit: (id: number, data: CreateInternalExtensionData) => Promise<void>
  onDelete: (id: number) => Promise<void>
  isLoading?: boolean
}

export function InternalExtensionTable({ extensions, onEdit, onDelete, isLoading }: InternalExtensionTableProps) {
  const [editingExtension, setEditingExtension] = useState<InternalExtension | null>(null)
  const [viewingExtension, setViewingExtension] = useState<InternalExtension | null>(null)
  const [deletingExtension, setDeletingExtension] = useState<InternalExtension | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getApplicationBadge = (application: string) => {
    const colors: Record<string, string> = {
      Zoiper: "bg-blue-100 text-blue-800",
      "X-Lite": "bg-green-100 text-green-800",
      "3CX Phone": "bg-purple-100 text-purple-800",
      MicroSIP: "bg-orange-100 text-orange-800",
      Linphone: "bg-pink-100 text-pink-800",
      Softphone: "bg-indigo-100 text-indigo-800",
    }

    return (
      <Badge className={colors[application] || "bg-gray-100 text-gray-800"}>
        <Settings className="h-3 w-3 mr-1" />
        {application}
      </Badge>
    )
  }

  const handleEdit = async (data: CreateInternalExtensionData) => {
    if (!editingExtension) return

    try {
      setIsSubmitting(true)
      await onEdit(editingExtension.id, data)
      setEditingExtension(null)
    } catch (error) {
      console.error("Erro ao editar ramal:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingExtension) return

    try {
      await onDelete(deletingExtension.id)
      setDeletingExtension(null)
    } catch (error) {
      console.error("Erro ao excluir ramal:", error)
    }
  }

  if (extensions.length === 0) {
    return (
      <div className="text-center py-8">
        <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">Nenhum ramal encontrado</h3>
        <p className="text-sm text-muted-foreground">
          Não há ramais internos cadastrados ou que correspondam aos filtros aplicados.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ramal</TableHead>
              <TableHead>Aplicação</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extensions.map((extension) => (
              <TableRow key={extension.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono font-medium">{extension.extension}</span>
                  </div>
                </TableCell>
                <TableCell>{getApplicationBadge(extension.application)}</TableCell>
                <TableCell>
                  {extension.createdAt ? new Date(extension.createdAt).toLocaleDateString("pt-BR") : "N/A"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewingExtension(extension)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingExtension(extension)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeletingExtension(extension)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
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

      {/* Modal de Visualização */}
      <Dialog open={!!viewingExtension} onOpenChange={() => setViewingExtension(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Ramal</DialogTitle>
          </DialogHeader>
          {viewingExtension && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ramal</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4" />
                    <span className="font-mono">{viewingExtension.extension}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Aplicação</label>
                  <div className="mt-1">{getApplicationBadge(viewingExtension.application)}</div>
                </div>
              </div>
              {viewingExtension.createdAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                  <p className="mt-1">{new Date(viewingExtension.createdAt).toLocaleString("pt-BR")}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={!!editingExtension} onOpenChange={() => setEditingExtension(null)}>
        <DialogContent className="w-[95vw] max-w-[1400px] xl:max-w-[1600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Ramal</DialogTitle>
          </DialogHeader>
          {editingExtension && (
            <InternalExtensionForm
              extension={editingExtension}
              onSubmit={handleEdit}
              onCancel={() => setEditingExtension(null)}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!deletingExtension} onOpenChange={() => setDeletingExtension(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o ramal {deletingExtension?.extension}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
