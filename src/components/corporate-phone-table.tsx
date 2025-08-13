"use client"

import { useState } from "react"
import { MoreHorizontal, Eye, Edit, Trash2, Phone, MessageCircle, Building, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { CorporatePhoneForm } from "@/components/corporate-phone-form"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { CorporatePhone, UpdateCorporatePhoneRequest } from "@/types/corporate-phone"

interface CorporatePhoneTableProps {
  corporatePhones: CorporatePhone[]
  onUpdate: (data: UpdateCorporatePhoneRequest) => Promise<CorporatePhone>
  onDelete: (id: number) => Promise<void>
  loading?: boolean
}

export function CorporatePhoneTable({ corporatePhones, onUpdate, onDelete, loading }: CorporatePhoneTableProps) {
  const [selectedPhone, setSelectedPhone] = useState<CorporatePhone | null>(null)
  const [editingPhone, setEditingPhone] = useState<CorporatePhone | null>(null)
  const [deletingPhone, setDeletingPhone] = useState<CorporatePhone | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { label: "Ativo", variant: "default" as const, className: "bg-green-100 text-green-800" },
      INACTIVE: { label: "Inativo", variant: "secondary" as const, className: "bg-gray-100 text-gray-800" },
      SUSPENDED: { label: "Suspenso", variant: "outline" as const, className: "bg-yellow-100 text-yellow-800" },
      CANCELLED: { label: "Cancelado", variant: "destructive" as const, className: "bg-red-100 text-red-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.INACTIVE
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getWhatsAppBadge = (blocked: boolean) => {
    return blocked ? (
      <Badge variant="destructive" className="bg-red-100 text-red-800">
        <MessageCircle className="h-3 w-3 mr-1" />
        Bloqueado
      </Badge>
    ) : (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <MessageCircle className="h-3 w-3 mr-1" />
        Liberado
      </Badge>
    )
  }

  const handleUpdate = async (data: UpdateCorporatePhoneRequest) => {
    try {
      setIsUpdating(true)
      await onUpdate(data)
      setEditingPhone(null)
    } catch (error) {
      console.error("Erro ao atualizar telefone:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingPhone) return

    try {
      setIsDeleting(true)
      await onDelete(deletingPhone.id)
      setDeletingPhone(null)
    } catch (error) {
      console.error("Erro ao excluir telefone:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading && corporatePhones.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-muted-foreground">Carregando telefones...</span>
      </div>
    )
  }

  if (corporatePhones.length === 0) {
    return (
      <div className="text-center py-8">
        <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum telefone encontrado</h3>
        <p className="text-sm text-muted-foreground">Comece criando um novo telefone corporativo.</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Operadora</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {corporatePhones.map((phone) => (
              <TableRow key={phone.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {phone.number}
                  </div>
                </TableCell>
                <TableCell>{phone.carrier}</TableCell>
                <TableCell>
                  <Badge variant="outline">{phone.planType === "PREPAID" ? "Pré-pago" : "Pós-pago"}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(phone.status)}</TableCell>
                <TableCell>{getWhatsAppBadge(phone.whatsappBlock)}</TableCell>
                <TableCell>
                  {phone.companyId ? (
                    <div className="flex items-center gap-1 text-sm">
                      <Building className="h-3 w-3" />
                      ID: {phone.companyId}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {phone.currentUserId ? (
                    <div className="flex items-center gap-1 text-sm">
                      <User className="h-3 w-3" />
                      ID: {phone.currentUserId}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedPhone(phone)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingPhone(phone)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeletingPhone(phone)} className="text-red-600">
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

      {/* Modal de Visualização */}
      <Dialog open={!!selectedPhone} onOpenChange={() => setSelectedPhone(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Telefone Corporativo</DialogTitle>
          </DialogHeader>
          {selectedPhone && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Número</label>
                  <p className="text-sm font-mono">{selectedPhone.number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Operadora</label>
                  <p className="text-sm">{selectedPhone.carrier}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo de Plano</label>
                  <p className="text-sm">{selectedPhone.planType === "PREPAID" ? "Pré-pago" : "Pós-pago"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedPhone.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">WhatsApp</label>
                  <div className="mt-1">{getWhatsAppBadge(selectedPhone.whatsappBlock)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID da Empresa</label>
                  <p className="text-sm">{selectedPhone.companyId || "Não atribuído"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID do Usuário</label>
                  <p className="text-sm">{selectedPhone.currentUserId || "Não atribuído"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                  <p className="text-sm">
                    {selectedPhone.createdAt ? new Date(selectedPhone.createdAt).toLocaleString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={!!editingPhone} onOpenChange={() => setEditingPhone(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Telefone Corporativo</DialogTitle>
          </DialogHeader>
          {editingPhone && (
            <CorporatePhoneForm
              initialData={editingPhone}
              onSubmit={(data) => handleUpdate({ ...data, id: editingPhone.id })}
              loading={isUpdating}
              onCancel={() => setEditingPhone(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!deletingPhone} onOpenChange={() => setDeletingPhone(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o telefone {deletingPhone?.number}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
