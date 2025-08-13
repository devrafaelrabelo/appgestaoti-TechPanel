"use client"

import { useState } from "react"
import { Tag, BarChart3, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResourceTypeFilterComponent } from "@/components/resource-type-filters"
import { ResourceTypeTable } from "@/components/resource-type-table"
import { ResourceTypeForm } from "@/components/resource-type-form"
import { ResourceTypeDetails } from "@/components/resource-type-details"
import { CreateResourceTypeModal } from "@/components/create-resource-type-modal"
import { useResourceTypesManagement } from "@/hooks/use-resource-types"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import { useToast } from "@/components/ui/use-toast"
import type { ResourceType, ResourceTypeFilters, ResourceTypeFormData } from "@/types/resource-type"

export default function ResourceTypesPage() {
  const [filters, setFilters] = useState<ResourceTypeFilters>({})
  const [editingResourceType, setEditingResourceType] = useState<ResourceType | null>(null)
  const [viewingResourceType, setViewingResourceType] = useState<ResourceType | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { resourceTypes, isLoading, error, refetch } = useResourceTypesManagement(filters)
  const { toast } = useToast()

  const updateResourceType = async (id: string, data: ResourceTypeFormData): Promise<ResourceType> => {
    const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceTypesCreate}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Erro ao atualizar tipo de recurso: ${response.status}`)
    }

    return response.json()
  }

  const deleteResourceType = async (id: string): Promise<void> => {
    const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceTypesIdDelete}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Erro ao excluir tipo de recurso: ${response.status}`)
    }
  }

  const handleUpdateResourceType = async (data: ResourceTypeFormData) => {
    if (!editingResourceType?.id) return

    setIsSubmitting(true)
    try {
      await updateResourceType(editingResourceType.id, data)

      toast({
        title: "Tipo de recurso atualizado",
        description: "O tipo de recurso foi atualizado com sucesso.",
      })

      setIsEditModalOpen(false)
      setEditingResourceType(null)
      refetch()
    } catch (error) {
      toast({
        title: "Erro ao atualizar tipo de recurso",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteResourceType = async (resourceTypeId: string) => {
    try {
      await deleteResourceType(resourceTypeId)

      toast({
        title: "Tipo de recurso excluído",
        description: "O tipo de recurso foi excluído com sucesso.",
      })

      refetch()
    } catch (error) {
      toast({
        title: "Erro ao excluir tipo de recurso",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleEdit = (resourceType: ResourceType) => {
    setEditingResourceType(resourceType)
    setIsEditModalOpen(true)
  }

  const handleView = (resourceType: ResourceType) => {
    setViewingResourceType(resourceType)
  }

  const handleEditCancel = () => {
    setIsEditModalOpen(false)
    setEditingResourceType(null)
  }

  // Calcular estatísticas
  const totalTypes = resourceTypes.length
  const activeTypes = resourceTypes.filter((rt) => rt.active).length
  const inactiveTypes = totalTypes - activeTypes

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Tag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar tipos de recurso</h3>
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
            <Tag className="h-8 w-8" />
            Tipos de Recurso
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie os tipos de recursos disponíveis no sistema</p>
        </div>
        <CreateResourceTypeModal onResourceTypeCreated={refetch} />
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tipos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTypes}</div>
            <p className="text-xs text-muted-foreground">tipos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeTypes}</div>
            <p className="text-xs text-muted-foreground">tipos ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <XCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{inactiveTypes}</div>
            <p className="text-xs text-muted-foreground">tipos inativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <ResourceTypeFilterComponent filters={filters} onFiltersChange={setFilters} />

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Lista de Tipos de Recurso
            {!isLoading && (
              <span className="text-sm font-normal text-muted-foreground">
                ({resourceTypes.length} {resourceTypes.length === 1 ? "item" : "itens"})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando tipos de recurso...</p>
              </div>
            </div>
          ) : (
            <ResourceTypeTable
              resourceTypes={resourceTypes}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDeleteResourceType}
              onRefresh={refetch}
            />
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Tipo de Recurso</DialogTitle>
          </DialogHeader>
          {editingResourceType && (
            <ResourceTypeForm
              resourceType={editingResourceType}
              onSubmit={handleUpdateResourceType}
              onCancel={handleEditCancel}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização */}
      <Dialog open={!!viewingResourceType} onOpenChange={() => setViewingResourceType(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Tipo de Recurso</DialogTitle>
          </DialogHeader>
          {viewingResourceType && (
            <ResourceTypeDetails
              resourceType={viewingResourceType}
              onEdit={() => {
                setEditingResourceType(viewingResourceType)
                setViewingResourceType(null)
                setIsEditModalOpen(true)
              }}
              onDelete={() => {
                handleDeleteResourceType(viewingResourceType.id)
                setViewingResourceType(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
