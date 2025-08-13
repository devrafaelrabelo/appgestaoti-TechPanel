"use client"

import { Edit, Trash2, Package, Calendar, User, CheckCircle, XCircle, Hash, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Resource } from "@/types/resource"

interface ResourceDetailsProps {
  resource: Resource
  onEdit: () => void
  onDelete: () => void
}

export function ResourceDetails({ resource, onEdit, onDelete }: ResourceDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{resource.name}</h2>
            <p className="text-muted-foreground">{resource.resourceType?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onEdit} size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button onClick={onDelete} variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome</label>
              <p className="text-sm font-medium">{resource.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo</label>
              <p className="text-sm">{resource.resourceType?.name || "—"}</p>
            </div>
          </div>

          {(resource.serialNumber || resource.location) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resource.serialNumber && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    Número de Série
                  </label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{resource.serialNumber}</p>
                </div>
              )}
              {resource.location && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Localização
                  </label>
                  <p className="text-sm">{resource.location}</p>
                </div>
              )}
            </div>
          )}

          {resource.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Descrição</label>
              <p className="text-sm mt-1 p-3 bg-muted rounded-md">{resource.description}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="flex items-center gap-2 mt-1">
              {resource.active ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <Badge variant="default">Ativo</Badge>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-gray-500" />
                  <Badge variant="secondary">Inativo</Badge>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID do Sistema</label>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{resource.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Criado em</label>
              <p className="text-sm">{formatDate(resource.createdAt)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Atualizado em</label>
              <p className="text-sm">{formatDate(resource.updatedAt)}</p>
            </div>
            {resource.createdBy && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Criado por</label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{resource.createdBy}</p>
                </div>
              </div>
            )}
          </div>

          {resource.updatedBy && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Atualizado por</label>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{resource.updatedBy}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
