"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Key, Shield, Zap, FileText, Calendar, Clock } from "lucide-react"
import { ACTION_COLORS, type Permission } from "@/types/permission"

interface PermissionDetailsProps {
  permission: Permission | null
  isOpen: boolean
  onClose: () => void
}

export function PermissionDetails({ permission, isOpen, onClose }: PermissionDetailsProps) {
  if (!permission) return null

  const getActionBadgeColor = (action: string) => {
    return ACTION_COLORS[action] || "bg-gray-100 text-gray-800"
  }

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Detalhes da Permissão
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Principais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Principais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome</label>
                <div className="mt-1">
                  <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{permission.name}</code>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                <p className="mt-1 text-sm">{permission.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    Recurso
                  </label>
                  <div className="mt-1">
                    <Badge variant="outline">{permission.resource}</Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    Ação
                  </label>
                  <div className="mt-1">
                    <Badge className={getActionBadgeColor(permission.action)}>{permission.action}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Metadados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Criado em
                  </label>
                  <p className="mt-1 text-sm">{formatDate(permission.createdAt)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Atualizado em
                  </label>
                  <p className="mt-1 text-sm">{formatDate(permission.updatedAt)}</p>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground">ID</label>
                <p className="mt-1 text-sm font-mono text-muted-foreground">{permission.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informações Técnicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Técnicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Formato da Permissão</label>
                <p className="mt-1 text-sm text-muted-foreground">
                  Esta permissão segue o padrão <code>recurso:acao</code>, onde:
                </p>
                <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>
                    <strong>Recurso:</strong> {permission.resource} - Identifica o tipo de recurso
                  </li>
                  <li>
                    <strong>Ação:</strong> {permission.action} - Define a operação permitida
                  </li>
                </ul>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Uso em Roles</label>
                <p className="mt-1 text-sm text-muted-foreground">
                  Esta permissão pode ser atribuída a roles para conceder acesso específico aos usuários.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
