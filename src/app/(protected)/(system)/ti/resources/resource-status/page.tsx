"use client"

import { useState } from "react"
import { Shield, BarChart3, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResourceStatusFilterComponent } from "@/components/resource-status-filters"
import { ResourceStatusTable } from "@/components/resource-status-table"
import { ResourceStatusForm } from "@/components/resource-status-form"
import { ResourceStatusDetails } from "@/components/resource-status-details"
import { CreateResourceStatusModal } from "@/components/create-resource-status-modal"
import { useResourceStatuses } from "@/hooks/use-resource-status"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import { useToast } from "@/components/ui/use-toast"
import type { ResourceStatus, ResourceStatusFilters, ResourceStatusFormData } from "@/types/resource-status"

export default function ResourceStatusPage() {
  const [filters, setFilters] = useState<ResourceStatusFilters>({})
  const [editingStatus, setEditingStatus] = useState<ResourceStatus | null>(null)
  const [viewingStatus, setViewingStatus] = useState<ResourceStatus | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { statuses, isLoading, error, refetch } = useResourceStatuses(filters)
  const { toast } = useToast()

  const handleUpdateStatus = async (data: ResourceStatusFormData) => {
    if (!editingStatus?.id) return

    setIsSubmitting(true)
    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceStatusIdAlter}${editingStatus.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao atualizar status: ${response.status}`)
      }

      toast({
        title: "Status atualizado",
        description: "O status foi atualizado com sucesso.",
      })

      setIsEditModalOpen(false)
      setEditingStatus(null)
      refetch()
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteStatus = async (statusId: string) => {
    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceStatusIdDelete}${statusId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao excluir status: ${response.status}`)
      }

      toast({
        title: "Status excluído",
        description: "O status foi excluído com sucesso.",
      })

      refetch()
    } catch (error) {
      toast({
        title: "Erro ao excluir status",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleEdit = (status: ResourceStatus) => {
    setEditingStatus(status)
    setIsEditModalOpen(true)
  }

  const handleView = (status: ResourceStatus) => {
    setViewingStatus(status)
  }

  const handleEditCancel = () => {
    setIsEditModalOpen(false)
    setEditingStatus(null)
  }

  // Calcular estatísticas
  const totalStatuses = statuses.length
  const allowsUsageCount = statuses.filter((status) => status.allowsUsage).length
  const blocksUsageCount = totalStatuses - allowsUsageCount

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar status</h3>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            <Button onClick={refetch}>Tentar novamente</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header da página */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Status de Recursos
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie os status dos recursos da empresa</p>
        </div>
        <CreateResourceStatusModal onStatusCreated={refetch} />
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Status</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStatuses}</div>
            <p className="text-xs text-muted-foreground">status cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permite Uso</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{allowsUsageCount}</div>
            <p className="text-xs text-muted-foreground">status que permitem uso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bloqueia Uso</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{blocksUsageCount}</div>
            <p className="text-xs text-muted-foreground">status que bloqueiam uso</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <ResourceStatusFilterComponent filters={filters} onFiltersChange={setFilters} />

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Lista de Status
            {!isLoading && (
              <span className="text-sm font-normal text-muted-foreground">
                ({statuses.length} {statuses.length === 1 ? "item" : "itens"})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando status...</p>
              </div>
            </div>
          ) : (
            <ResourceStatusTable
              statuses={statuses}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDeleteStatus}
              onRefresh={refetch}
            />
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[95vw] max-w-[1400px] xl:max-w-[1600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Status</DialogTitle>
          </DialogHeader>
          {editingStatus && (
            <ResourceStatusForm
              status={editingStatus}
              onSubmit={handleUpdateStatus}
              onCancel={handleEditCancel}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização */}
      <Dialog open={!!viewingStatus} onOpenChange={() => setViewingStatus(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Status</DialogTitle>
          </DialogHeader>
          {viewingStatus && (
            <ResourceStatusDetails
              status={viewingStatus}
              onEdit={() => {
                setEditingStatus(viewingStatus)
                setViewingStatus(null)
                setIsEditModalOpen(true)
              }}
              onDelete={() => {
                handleDeleteStatus(viewingStatus.id)
                setViewingStatus(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
