"use client"

import { useState } from "react"
import { Edit, Trash2, Phone, Building, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { CorporatePhoneForm } from "./corporate-phone-form"
import type { CorporatePhone, UpdateCorporatePhoneRequest } from "@/types/corporate-phone"
import { useToast } from "@/components/ui/use-toast"

interface CorporatePhoneDetailsProps {
  corporatePhone: CorporatePhone
  onUpdate: (data: UpdateCorporatePhoneRequest) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onClose: () => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800 border-green-200"
    case "INACTIVE":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "SUSPENDED":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Ativo"
    case "INACTIVE":
      return "Inativo"
    case "SUSPENDED":
      return "Suspenso"
    case "CANCELLED":
      return "Cancelado"
    default:
      return status
  }
}

const getPlanTypeLabel = (planType: string) => {
  switch (planType) {
    case "PREPAID":
      return "Pré-pago"
    case "POSTPAID":
      return "Pós-pago"
    case "CORPORATE":
      return "Corporativo"
    default:
      return planType
  }
}

export function CorporatePhoneDetails({ corporatePhone, onUpdate, onDelete, onClose }: CorporatePhoneDetailsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleUpdate = async (data: UpdateCorporatePhoneRequest) => {
    try {
      setLoading(true)
      await onUpdate(data)
      toast({
        title: "Sucesso",
        description: "Telefone corporativo atualizado com sucesso.",
      })
      setIsEditModalOpen(false)
      onClose()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar telefone corporativo. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      await onDelete(corporatePhone.id)
      toast({
        title: "Sucesso",
        description: "Telefone corporativo excluído com sucesso.",
      })
      setIsDeleteDialogOpen(false)
      onClose()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir telefone corporativo. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header com ações */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Phone className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{corporatePhone.number}</h2>
              <p className="text-sm text-muted-foreground">
                {corporatePhone.carrier} - {getPlanTypeLabel(corporatePhone.planType)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)} disabled={loading}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={loading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>

        {/* Informações principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Informações do Telefone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Número</label>
                <p className="text-sm font-mono">{corporatePhone.number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Operadora</label>
                <p className="text-sm">{corporatePhone.carrier}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo de Plano</label>
                <p className="text-sm">{getPlanTypeLabel(corporatePhone.planType)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge className={getStatusColor(corporatePhone.status)}>
                    {getStatusLabel(corporatePhone.status)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-4 w-4" />
                Informações de Alocação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID da Empresa</label>
                <p className="text-sm">{corporatePhone.companyId ? `#${corporatePhone.companyId}` : "Não atribuído"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Usuário Atual</label>
                <p className="text-sm flex items-center gap-2">
                  {corporatePhone.currentUserId ? (
                    <>
                      <User className="h-4 w-4" />
                      ID: {corporatePhone.currentUserId}
                    </>
                  ) : (
                    "Não atribuído"
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações de auditoria */}
        {(corporatePhone.createdAt || corporatePhone.updatedAt) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Informações de Auditoria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {corporatePhone.createdAt && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                    <p className="text-sm">{new Date(corporatePhone.createdAt).toLocaleString("pt-BR")}</p>
                  </div>
                )}
                {corporatePhone.updatedAt && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Atualizado em</label>
                    <p className="text-sm">{new Date(corporatePhone.updatedAt).toLocaleString("pt-BR")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Telefone Corporativo</DialogTitle>
          </DialogHeader>
          <CorporatePhoneForm
            initialData={corporatePhone}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditModalOpen(false)}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o telefone corporativo "{corporatePhone.number}"? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700">
              {loading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
