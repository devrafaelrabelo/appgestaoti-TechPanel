"use client"

import { Shield, ShieldOff, Code, FileText, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { ResourceStatus } from "@/types/resource-status"

interface ResourceStatusDetailsProps {
  status: ResourceStatus
  onEdit?: () => void
  onDelete?: () => void
}

export function ResourceStatusDetails({ status, onEdit, onDelete }: ResourceStatusDetailsProps) {
  const jsonExample = JSON.stringify(
    {
      code: status.code,
      name: status.name,
      description: status.description,
      blocksAllocation: status.blocksAllocation,
    },
    null,
    2,
  )

  return (
    <div className="space-y-6">
      {/* Informações Principais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Informações do Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Código</h4>
              <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{status.code}</code>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Nome</h4>
              <p className="font-medium">{status.name}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Descrição</h4>
            <p className="text-sm">{status.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Comportamento de Alocação</h4>
            <Badge
              variant={status.blocksAllocation ? "destructive" : "default"}
              className="flex items-center gap-1 w-fit"
            >
              {status.blocksAllocation ? (
                <>
                  <ShieldOff className="h-3 w-3" />
                  Bloqueia Alocação
                </>
              ) : (
                <>
                  <Shield className="h-3 w-3" />
                  Permite Alocação
                </>
              )}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {status.blocksAllocation
                ? "Recursos com este status não podem ser alocados para novos projetos ou usuários"
                : "Recursos com este status estão disponíveis para alocação"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Exemplo de Uso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Exemplo de JSON
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Este é o formato JSON que será enviado para a API ao criar ou atualizar este status:
          </p>
          <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto border">
            <code>{jsonExample}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informações Adicionais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <h4 className="font-medium mb-1">Uso Recomendado:</h4>
            <p className="text-muted-foreground">
              {status.blocksAllocation
                ? "Use este status para recursos que estão temporariamente indisponíveis, em manutenção, ou que não devem ser alocados por outros motivos."
                : "Use este status para recursos que estão disponíveis e podem ser alocados normalmente para projetos e usuários."}
            </p>
          </div>

          <Separator />

          <div className="text-sm">
            <h4 className="font-medium mb-1">Impacto no Sistema:</h4>
            <ul className="text-muted-foreground space-y-1 ml-4">
              <li className="list-disc">
                {status.blocksAllocation
                  ? "Recursos com este status não aparecerão em listas de recursos disponíveis"
                  : "Recursos com este status estarão visíveis para alocação"}
              </li>
              <li className="list-disc">
                {status.blocksAllocation
                  ? "Tentativas de alocação serão bloqueadas automaticamente"
                  : "Alocações serão permitidas normalmente"}
              </li>
              <li className="list-disc">O status será exibido em relatórios e dashboards</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      {(onEdit || onDelete) && (
        <div className="flex justify-end gap-3">
          {onEdit && (
            <Button onClick={onEdit} variant="outline">
              Editar Status
            </Button>
          )}
          {onDelete && (
            <Button onClick={onDelete} variant="destructive">
              Excluir Status
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
