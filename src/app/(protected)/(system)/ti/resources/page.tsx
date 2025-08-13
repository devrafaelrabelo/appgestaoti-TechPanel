"use client"

import { useState } from "react"
import { Package, BarChart3, CheckCircle, XCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResourceFilterComponent } from "@/components/resource-filters"
import { ResourceTable } from "@/components/resource-table"
import { ResourceForm } from "@/components/resource-form"
import { ResourceDetails } from "@/components/resource-details"
import { useResources } from "@/hooks/use-resources"
import type { Resource, ResourceFormData } from "@/types/resource"

export default function ResourcesPage() {
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [viewingResource, setViewingResource] = useState<Resource | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    resources,
    filters,
    pagination,
    isLoading,
    error,
    refetch,
    updateFilters,
    changePage,
    changePageSize,
    createResource,
    updateResource,
    deleteResource,
  } = useResources()

  const handleCreateResource = async (data: ResourceFormData) => {
    setIsSubmitting(true)
    try {
      await createResource(data)
      setIsCreateModalOpen(false)
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateResource = async (data: ResourceFormData) => {
    if (!editingResource?.id) return

    setIsSubmitting(true)
    try {
      await updateResource(editingResource.id, data)
      setIsEditModalOpen(false)
      setEditingResource(null)
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteResource = async (resourceId: string) => {
    try {
      await deleteResource(resourceId)
    } catch (error) {
      // Error is handled in the hook
      throw error
    }
  }

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource)
    setIsEditModalOpen(true)
  }

  const handleView = (resource: Resource) => {
    setViewingResource(resource)
  }

  const handleEditCancel = () => {
    setIsEditModalOpen(false)
    setEditingResource(null)
  }

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false)
  }

  // Calcular estatísticas
  const totalResources = pagination.totalElements
  const activeResources = resources.filter(
    (resource) =>
      resource.status?.toLowerCase().includes("ativo") || resource.status?.toLowerCase().includes("disponível"),
  ).length
  const inactiveResources = resources.filter(
    (resource) =>
      resource.status?.toLowerCase().includes("inativo") || resource.status?.toLowerCase().includes("manutenção"),
  ).length

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar recursos</h3>
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
            <Package className="h-8 w-8" />
            Recursos
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie os equipamentos e recursos da empresa</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Recurso
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Recursos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResources}</div>
            <p className="text-xs text-muted-foreground">recursos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeResources}</div>
            <p className="text-xs text-muted-foreground">recursos disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inactiveResources}</div>
            <p className="text-xs text-muted-foreground">recursos indisponíveis</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <ResourceFilterComponent filters={filters} onFiltersChange={updateFilters} />

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lista de Recursos
            {!isLoading && (
              <span className="text-sm font-normal text-muted-foreground">
                ({pagination.totalElements} {pagination.totalElements === 1 ? "item" : "itens"})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceTable
            resources={resources}
            pagination={pagination}
            isLoading={isLoading}
            onPageChange={changePage}
            onPageSizeChange={changePageSize}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteResource}
          />
        </CardContent>
      </Card>

      {/* Modal de Criação */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Recurso</DialogTitle>
          </DialogHeader>
          <ResourceForm onSubmit={handleCreateResource} onCancel={handleCreateCancel} isSubmitting={isSubmitting} />
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Recurso</DialogTitle>
          </DialogHeader>
          {editingResource && (
            <ResourceForm
              resource={editingResource}
              onSubmit={handleUpdateResource}
              onCancel={handleEditCancel}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização */}
      <Dialog open={!!viewingResource} onOpenChange={() => setViewingResource(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Recurso</DialogTitle>
          </DialogHeader>
          {viewingResource && (
            <ResourceDetails
              resource={viewingResource}
              onEdit={() => {
                setEditingResource(viewingResource)
                setViewingResource(null)
                setIsEditModalOpen(true)
              }}
              onDelete={() => {
                handleDeleteResource(viewingResource.id)
                setViewingResource(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
